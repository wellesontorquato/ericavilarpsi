import Head from "next/head";
import { useRef, useState } from "react";
import "@/styles/live-maio.css";

const LIMITE_SUBTEMAS = 5;

const gruposSubtemas = [
  {
    id: "psicologia",
    titulo: "Da Psicóloga",
    resumo: "Carga mental, ansiedade e vulnerabilidade emocional",
    subtemas: [
      "A carga mental da mulher grávida",
      "Gestação e vulnerabilidade emocional: por que algumas mulheres adoecem psicologicamente?",
      "Ansiedade materna",
      "Picos hormonais e impactos emocionais",
    ],
  },
  {
    id: "fisio",
    titulo: "Da Fisio",
    resumo: "Corpo, dor, movimento e preparação física",
    subtemas: [
      "O corpo da gestante sem filtro",
      "Dor na gestação: até onde é normal?",
      "Movimento na gestação: medo x necessidade",
      "Recursos para alívio físico na gestação",
      "O peso físico da gestação",
      "Preparação do corpo para o parto",
      "Mitos sobre o corpo na gestação",
      "Cuidado individualizado na gestação",
      "Conexão com o corpo durante a gestação",
    ],
  },
];

const temasResumo = [
  "Carga mental, ansiedade e vulnerabilidade emocional",
  "Picos hormonais e impactos emocionais",
  "Corpo real da gestante",
  "Dor, desconfortos e limites do normal",
  "Movimento, medo e preparação para o parto",
  "Cuidado individualizado e conexão com o corpo",
];

function formatBrazilianWhatsapp(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function LiveMaio() {
  return (
    <>
      <Head>
        <title>Live Maio | Gestação sem filtro</title>
        <meta
          name="description"
          content="Live gratuita no Instagram com Erica Vilar e Lizia Nascimento sobre gestação, corpo, emoções, preparação e pós-parto."
        />
      </Head>

      <main className="liveMaioPage">
        <div className="backgroundWord">GESTAÇÃO</div>
        <div className="light lightOne" />
        <div className="light lightTwo" />

        <section className="heroSection">
          <div className="heroCard">
            <div className="heroCopy">
              <div className="liveBadge">
                <span />
                Live gratuita no Instagram
              </div>

              <div className="eventInfo">
                <span>24 de maio</span>
                <span>17h</span>
                <span>60 minutos</span>
              </div>

              <p className="preTitle">Para gestantes, tentantes e mães recentes</p>

              <h1 className="heroTitle">
                Gestação sem filtro:
                <em> o que você precisa saber e quase ninguém te contou.</em>
              </h1>

              <p className="heroText">
                Uma conversa real sobre corpo, emoções, medos, preparação,
                parto e pós-parto.
              </p>

              <a href="#inscricao" className="heroCta">
                Quero entrar na lista VIP
                <span>↗</span>
              </a>
            </div>

            <div className="speakersBlock">
              <SpeakerPhotos />
            </div>

            <div className="proofColumns">
              <div className="proofGroup">
                <p>Na live</p>

                <div className="quickProof">
                  <span>Sem romantização</span>
                  <span>Com acolhimento</span>
                  <span>Com orientação profissional</span>
                </div>
              </div>

              <div className="proofGroup proofGroupVip">
                <p>Na lista VIP</p>

                <div className="quickProof">
                  <span>Grupo VIP da live</span>
                  <span>Mimos e materiais após a live</span>
                  <span>Lembretes exclusivos no WhatsApp</span>
                </div>
              </div>
            </div>

            <FormCard />
          </div>
        </section>

        <section className="topicsSection">
          <div className="topicsHeader">
            <span>O que será conversado</span>
            <h2>Uma conversa ampla, mas com espaço para o que você mais precisa</h2>
          </div>

          <div className="topicsGrid">
            {temasResumo.map((tema) => (
              <article key={tema}>
                <span>✓</span>
                <p>{tema}</p>
              </article>
            ))}
          </div>

          <a href="#inscricao" className="bottomCta">
            Garantir meu lugar no grupo VIP
            <span>↗</span>
          </a>
        </section>
      </main>
    </>
  );
}

function SpeakerPhotos() {
  const [openSpeaker, setOpenSpeaker] = useState(null);

  const speakers = [
    {
      id: "erica",
      role: "Psicóloga Clínica",
      name: "Erica Vilar",
      image: "/erica-live.png",
      alt: "Psicóloga Erica Vilar",
      bio:
        "Psicóloga clínica, fala sobre saúde emocional feminina, maternidade, vínculos e autocuidado com sensibilidade e profundidade.",
    },
    {
      id: "lizia",
      role: "Fisioterapeuta e doula",
      name: "Lizia Nascimento",
      image: "/lizia-live.png",
      alt: "Fisioterapeuta e doula Lizia Nascimento",
      bio:
        "Atua no cuidado integral da mulher da gestação ao pós-parto, unindo técnica, acolhimento e escuta.",
    },
  ];

  return (
    <div className="speakers">
      {speakers.map((speaker) => {
        const isOpen = openSpeaker === speaker.id;

        return (
          <button
            type="button"
            className={`speakerCard ${isOpen ? "isOpen" : ""}`}
            key={speaker.id}
            onClick={() => setOpenSpeaker(isOpen ? null : speaker.id)}
            aria-expanded={isOpen}
            aria-label={`${
              isOpen ? "Fechar informações de" : "Abrir informações de"
            } ${speaker.name}`}
          >
            <img src={speaker.image} alt={speaker.alt} />

            <div className="speakerName">
              <span>{speaker.role}</span>
              <strong>{speaker.name}</strong>
              <small className="tapHint">Clique/toque para saber mais</small>
            </div>

            <div className="speakerBio">
              <p>{speaker.bio}</p>
              <small>Clique/toque para fechar</small>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function FormCard() {
  const [whatsapp, setWhatsapp] = useState("");
  const [grupoAberto, setGrupoAberto] = useState("psicologia");
  const [subtemasSelecionados, setSubtemasSelecionados] = useState([]);
  const touchStartY = useRef(0);

  const atingiuLimite = subtemasSelecionados.length >= LIMITE_SUBTEMAS;

  function toggleSubtema(subtema) {
    setSubtemasSelecionados((atuais) => {
      const jaSelecionado = atuais.includes(subtema);

      if (jaSelecionado) {
        return atuais.filter((item) => item !== subtema);
      }

      if (atuais.length >= LIMITE_SUBTEMAS) {
        return atuais;
      }

      return [...atuais, subtema];
    });
  }

  function contarSelecionadosDoGrupo(subtemas) {
    return subtemas.filter((subtema) => subtemasSelecionados.includes(subtema))
      .length;
  }

  function handleTopicWheel(event) {
    const element = event.currentTarget;

    const isAtTop = element.scrollTop <= 0;
    const isAtBottom =
      Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight;

    const isScrollingUp = event.deltaY < 0;
    const isScrollingDown = event.deltaY > 0;

    if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
      event.preventDefault();
    }

    event.stopPropagation();
  }

  function handleTopicTouchStart(event) {
    touchStartY.current = event.touches[0].clientY;
  }

  function handleTopicTouchMove(event) {
    const element = event.currentTarget;
    const currentY = event.touches[0].clientY;

    const isAtTop = element.scrollTop <= 0;
    const isAtBottom =
      Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight;

    const fingerMovingDown = currentY > touchStartY.current;
    const fingerMovingUp = currentY < touchStartY.current;

    if ((isAtTop && fingerMovingDown) || (isAtBottom && fingerMovingUp)) {
      event.preventDefault();
    }

    event.stopPropagation();
  }

  return (
    <aside className="formCard" id="inscricao">
      <div className="formHeader">
        <span>Acesso VIP gratuito</span>
        <h2>Entre na lista exclusiva da live</h2>
        <p>
          Preencha em menos de 1 minuto para receber o lembrete, acessar o grupo
          VIP e ganhar os materiais enviados depois da live.
        </p>
      </div>

      <form className="leadForm" action="/api/leads/live-maio" method="POST">
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" name="nome" placeholder="Seu nome" required />
        </div>

        <div className="field">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            id="whatsapp"
            type="tel"
            name="whatsapp"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            maxLength={15}
            onChange={(event) => {
              setWhatsapp(formatBrazilianWhatsapp(event.target.value));
            }}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="seuemail@exemplo.com"
            required
          />
        </div>

        <div className="vipNotice">
          <div className="vipIcon">✦</div>

          <div>
            <strong>Após a inscrição, você será direcionada para o grupo VIP.</strong>
            <p>
              Por lá, você recebe os lembretes da live, avisos importantes e os
              mimos com materiais de apoio depois do encontro.
            </p>
          </div>
        </div>

        <div className="topicPicker">
          <div className="topicPickerTop">
            <div>
              <span className="topicEyebrow">Subtemas de interesse</span>
              <strong>Opcional: escolha até 5 temas</strong>
            </div>

            <em className="topicCounter">
              {subtemasSelecionados.length}/{LIMITE_SUBTEMAS}
            </em>
          </div>

          <p className="topicHelp">
            Essa escolha ajuda a direcionar a conversa, mas não é obrigatória.
          </p>

          {gruposSubtemas.map((grupo) => {
            const isOpen = grupoAberto === grupo.id;
            const selecionadosDoGrupo = contarSelecionadosDoGrupo(grupo.subtemas);

            return (
              <section
                className={`topicCategory ${isOpen ? "isOpen" : ""}`}
                key={grupo.id}
              >
                <button
                  type="button"
                  className="topicCategoryHeader"
                  onClick={() => setGrupoAberto(isOpen ? null : grupo.id)}
                  aria-expanded={isOpen}
                >
                  <span>
                    <strong>{grupo.titulo}</strong>
                    <small>
                      {selecionadosDoGrupo > 0
                        ? `${selecionadosDoGrupo} selecionado${
                            selecionadosDoGrupo > 1 ? "s" : ""
                          }`
                        : grupo.resumo}
                    </small>
                  </span>

                  <b>{isOpen ? "−" : "+"}</b>
                </button>

                <div className="topicCategoryBody" aria-hidden={!isOpen}>
                  <div className="topicCategoryInner">
                    <div
                      className="topicChips"
                      onWheel={handleTopicWheel}
                      onTouchStart={handleTopicTouchStart}
                      onTouchMove={handleTopicTouchMove}
                    >
                      {grupo.subtemas.map((subtema) => {
                        const isSelected = subtemasSelecionados.includes(subtema);
                        const isDisabled = atingiuLimite && !isSelected;

                        return (
                          <button
                            type="button"
                            key={subtema}
                            className={`topicChip ${
                              isSelected ? "isSelected" : ""
                            } ${isDisabled ? "isDisabled" : ""}`}
                            onClick={() => toggleSubtema(subtema)}
                            disabled={isDisabled}
                            tabIndex={isOpen ? 0 : -1}
                            aria-pressed={isSelected}
                          >
                            <span>{isSelected ? "✓" : "+"}</span>
                            {subtema}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}

          {subtemasSelecionados.length > 0 && (
            <div className="selectedTopics">
              {subtemasSelecionados.map((subtema) => (
                <span key={subtema}>{subtema}</span>
              ))}
            </div>
          )}

          {atingiuLimite && (
            <p className="limitAlert">
              Você selecionou o máximo de 5 subtemas. Para escolher outro,
              remova um dos temas selecionados.
            </p>
          )}

          {subtemasSelecionados.map((subtema) => (
            <input type="hidden" name="subtemas" value={subtema} key={subtema} />
          ))}
        </div>

        <label className="consent">
          <input type="checkbox" name="consentimento" required />
          <span>
            <strong>Obrigatório:</strong> aceito receber comunicações sobre esta
            live e conteúdos relacionados por WhatsApp e e-mail.
          </span>
        </label>

        <button className="submit" type="submit">
          Finalizar inscrição e entrar no grupo
          <span>↗</span>
        </button>

        <p className="safeNote">
          Ao enviar, você será direcionada para entrar no grupo VIP da live.
        </p>
      </form>
    </aside>
  );
}