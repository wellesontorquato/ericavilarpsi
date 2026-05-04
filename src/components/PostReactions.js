import { useEffect, useMemo, useState } from "react";
import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  listenToAuthState,
  signInWithGoogle,
  logoutUser,
} from "@/lib/firebase";

const REACTIONS = [
  {
    type: "amei",
    emoji: "❤️",
    label: "Amei",
  },
  {
    type: "acolheu",
    emoji: "🌿",
    label: "Me acolheu",
  },
  {
    type: "refletir",
    emoji: "💭",
    label: "Refleti",
  },
  {
    type: "gostei",
    emoji: "👏",
    label: "Gostei",
  },
];

export default function PostReactions({ postSlug, variant = "default" }) {
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({});
  const [userReaction, setUserReaction] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isCompact = variant === "compact";

  const totalReactions = useMemo(() => {
    return Object.values(counts).reduce((total, value) => total + value, 0);
  }, [counts]);

  useEffect(() => {
    const unsubscribe = listenToAuthState((currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!postSlug) return;

    async function loadReactions() {
      try {
        setIsLoading(true);

        const reactionsRef = collection(db, "posts", postSlug, "reactions");
        const snapshot = await getDocs(reactionsRef);

        const nextCounts = {};

        REACTIONS.forEach((reaction) => {
          nextCounts[reaction.type] = 0;
        });

        snapshot.forEach((item) => {
          const data = item.data();
          const type = data?.type;

          if (type && nextCounts[type] !== undefined) {
            nextCounts[type] += 1;
          }
        });

        setCounts(nextCounts);
      } catch (error) {
        console.error("Erro ao carregar reações:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReactions();
  }, [postSlug]);

  useEffect(() => {
    if (!postSlug || !user?.uid) {
      setUserReaction("");
      return;
    }

    async function loadUserReaction() {
      try {
        const reactionRef = doc(db, "posts", postSlug, "reactions", user.uid);
        const snapshot = await getDoc(reactionRef);

        if (snapshot.exists()) {
          setUserReaction(snapshot.data()?.type || "");
        } else {
          setUserReaction("");
        }
      } catch (error) {
        console.error("Erro ao carregar reação do usuário:", error);
      }
    }

    loadUserReaction();
  }, [postSlug, user?.uid]);

  async function handleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao entrar com Google:", error);
      alert("Não foi possível entrar com Google agora. Tente novamente.");
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  }

  async function handleReactionClick(type) {
    if (!user) {
      await handleSignIn();
      return;
    }

    if (!postSlug || isSaving) return;

    try {
      setIsSaving(true);

      const reactionRef = doc(db, "posts", postSlug, "reactions", user.uid);

      if (userReaction === type) {
        await deleteDoc(reactionRef);

        setCounts((current) => ({
          ...current,
          [type]: Math.max((current[type] || 1) - 1, 0),
        }));

        setUserReaction("");
        return;
      }

      await setDoc(reactionRef, {
        type,
        userId: user.uid,
        userName: user.displayName || "",
        userEmail: user.email || "",
        userPhoto: user.photoURL || "",
        postSlug,
        updatedAt: serverTimestamp(),
      });

      setCounts((current) => {
        const next = { ...current };

        if (userReaction && next[userReaction] !== undefined) {
          next[userReaction] = Math.max((next[userReaction] || 1) - 1, 0);
        }

        next[type] = (next[type] || 0) + 1;

        return next;
      });

      setUserReaction(type);
    } catch (error) {
      console.error("Erro ao salvar reação:", error);
      alert("Não foi possível salvar sua reação agora. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className={`post-reactions ${isCompact ? "post-reactions-compact" : ""}`}>
      <div className="post-reactions-header">
        <span className="section-label">Reações</span>

        <h2>{isCompact ? "Esse texto tocou você?" : "Esse artigo tocou você?"}</h2>

        {!isCompact && (
          <p>
            Escolha uma reação para mostrar como esse texto chegou até você.
          </p>
        )}
      </div>

      <div className="post-reactions-grid">
        {REACTIONS.map((reaction) => {
          const isActive = userReaction === reaction.type;

          return (
            <button
              key={reaction.type}
              type="button"
              className={`post-reaction-btn ${isActive ? "is-active" : ""}`}
              onClick={() => handleReactionClick(reaction.type)}
              disabled={isSaving}
              title={reaction.label}
            >
              <span className="post-reaction-emoji">{reaction.emoji}</span>
              <span className="post-reaction-label">{reaction.label}</span>
              <span className="post-reaction-count">
                {isLoading ? "..." : counts[reaction.type] || 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="post-reactions-footer">
        {!isCompact && totalReactions > 0 && (
            <p>
                {totalReactions} {totalReactions === 1 ? "reação" : "reações"}.
            </p>
        )}

        {!user ? (
          <button
            type="button"
            className="post-auth-btn"
            onClick={handleSignIn}
          >
            Entrar com Google
          </button>
        ) : (
          <div className="post-auth-user">
            {user.photoURL && (
              <img src={user.photoURL} alt={user.displayName || "Usuário"} />
            )}

            <span>{user.displayName || user.email}</span>

            <button type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
      </div>
    </section>
  );
}