import { useEffect, useMemo, useState } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  listenToAuthState,
  signInWithGoogle,
  logoutUser,
} from "@/lib/firebase";

const MAX_COMMENT_LENGTH = 800;

export default function PostComments({ postSlug }) {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const remainingChars = useMemo(() => {
    return MAX_COMMENT_LENGTH - commentText.length;
  }, [commentText]);

  useEffect(() => {
    const unsubscribe = listenToAuthState((currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!postSlug) return;

    async function loadApprovedComments() {
      try {
        setIsLoadingComments(true);

        const commentsRef = collection(db, "posts", postSlug, "comments");

        const commentsQuery = query(
            commentsRef,
            where("status", "==", "approved")
            );

            const snapshot = await getDocs(commentsQuery);

            const approvedComments = snapshot.docs
            .map((item) => {
                const data = item.data();

                return {
                id: item.id,
                userName: data.userName || "Leitora",
                userPhoto: data.userPhoto || "",
                text: data.text || "",
                createdAt: data.createdAt || null,
                };
            })
            .sort((a, b) => {
                const dateA =
                a.createdAt && typeof a.createdAt.toDate === "function"
                    ? a.createdAt.toDate().getTime()
                    : 0;

                const dateB =
                b.createdAt && typeof b.createdAt.toDate === "function"
                    ? b.createdAt.toDate().getTime()
                    : 0;

                return dateB - dateA;
            });

            setComments(approvedComments);
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
        setErrorMessage(
          "Não foi possível carregar os comentários agora. Tente novamente mais tarde."
        );
      } finally {
        setIsLoadingComments(false);
      }
    }

    loadApprovedComments();
  }, [postSlug]);

  async function handleSignIn() {
    try {
      setErrorMessage("");
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao entrar com Google:", error);
      setErrorMessage("Não foi possível entrar com Google agora. Tente novamente.");
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!user) {
      await handleSignIn();
      return;
    }

    const cleanText = commentText.trim();

    if (cleanText.length < 3) {
      setErrorMessage("Escreva um comentário um pouco maior antes de enviar.");
      return;
    }

    if (cleanText.length > MAX_COMMENT_LENGTH) {
      setErrorMessage(`Seu comentário precisa ter até ${MAX_COMMENT_LENGTH} caracteres.`);
      return;
    }

    if (!postSlug || isSending) return;

    try {
      setIsSending(true);

      const commentsRef = collection(db, "posts", postSlug, "comments");

      await addDoc(commentsRef, {
        postSlug,
        text: cleanText,
        status: "pending",
        userId: user.uid,
        userName: user.displayName || "Leitora",
        userEmail: user.email || "",
        userPhoto: user.photoURL || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setCommentText("");
      setSuccessMessage(
        "Comentário enviado. Ele será revisado antes de aparecer publicamente."
      );
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      setErrorMessage("Não foi possível enviar seu comentário agora. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="post-comments">
      <div className="post-comments-header">
        <span className="section-label">Comentários</span>

        <h2>Quer deixar uma reflexão?</h2>

        <p>
          Compartilhe algo que esse texto despertou em você. Os comentários são
          revisados antes de aparecerem publicamente.
        </p>
      </div>

      <div className="post-comments-box">
        {!user ? (
          <div className="post-comments-login">
            <p>
              Para comentar, entre com sua conta Google. Isso ajuda a manter este
              espaço mais seguro e acolhedor.
            </p>

            <button type="button" className="post-comments-auth-btn" onClick={handleSignIn}>
              Entrar com Google para comentar
            </button>
          </div>
        ) : (
          <form className="post-comments-form" onSubmit={handleSubmit}>
            <div className="post-comments-user">
              {user.photoURL && (
                <img src={user.photoURL} alt={user.displayName || "Usuário"} />
              )}

              <div>
                <span>Comentando como</span>
                <strong>{user.displayName || user.email}</strong>
              </div>

              <button type="button" onClick={handleLogout}>
                Sair
              </button>
            </div>

            <label className="post-comments-field">
              <span>Sua reflexão</span>

              <textarea
                value={commentText}
                onChange={(event) => {
                  setCommentText(event.target.value);
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                maxLength={MAX_COMMENT_LENGTH}
                rows={3}
                placeholder="Escreva seu comentário com cuidado e respeito..."
              />
            </label>

            <div className="post-comments-form-footer">
              <small
                className={
                  remainingChars < 80
                    ? "post-comments-counter is-warning"
                    : "post-comments-counter"
                }
              >
                {remainingChars} caracteres restantes
              </small>

              <button
                type="submit"
                className="post-comments-submit"
                disabled={isSending || commentText.trim().length < 3}
              >
                {isSending ? "Enviando..." : "Enviar comentário"}
              </button>
            </div>
          </form>
        )}

        {successMessage && (
          <div className="post-comments-message success">{successMessage}</div>
        )}

        {errorMessage && (
          <div className="post-comments-message error">{errorMessage}</div>
        )}
      </div>

      <div className="post-comments-list-wrap">
        <div className="post-comments-list-head">
          <h3>Comentários publicados</h3>

          <span>
            {comments.length} {comments.length === 1 ? "comentário" : "comentários"}
          </span>
        </div>

        {isLoadingComments && (
          <p className="post-comments-empty">Carregando comentários...</p>
        )}

        {!isLoadingComments && comments.length === 0 && (
          <p className="post-comments-empty">
            Ainda não há comentários publicados neste artigo.
          </p>
        )}

        {!isLoadingComments && comments.length > 0 && (
          <div className="post-comments-list">
            {comments.map((comment) => (
              <article className="post-comment-card" key={comment.id}>
                <div className="post-comment-avatar">
                  {comment.userPhoto ? (
                    <img src={comment.userPhoto} alt={comment.userName} />
                  ) : (
                    <span>{getInitials(comment.userName)}</span>
                  )}
                </div>

                <div className="post-comment-content">
                  <div className="post-comment-meta">
                    <strong>{comment.userName}</strong>
                    <span>{formatCommentDate(comment.createdAt)}</span>
                  </div>

                  <p>{comment.text}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "EV";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatCommentDate(timestamp) {
  try {
    if (!timestamp) return "Agora";

    const date =
      typeof timestamp.toDate === "function"
        ? timestamp.toDate()
        : new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}