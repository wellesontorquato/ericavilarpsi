import Image from 'next/image';
import Link from 'next/link';

export default function ImersaoGestacaoSemFiltro() {
  return (
    <main className="min-h-screen font-sans text-[#090909] bg-white overflow-x-hidden">
      
      {/* SECTION: Hero */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 flex flex-col items-start text-left z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-[#9b0300] font-roboto leading-tight mb-4">
            ✨ Imersão Gestação Sem Filtro ✨
          </h2>
          <p className="text-lg md:text-xl font-medium mb-6">
            Uma experiência próxima, cuidadosa e especial. 🤍
          </p>
          <p className="text-base md:text-lg mb-6 leading-relaxed">
            Mais do que um evento, será uma vivência real, profunda e acolhedora para mulheres e casais que desejam se preparar para a gestação, parto e pós-parto com mais <strong className="font-bold">consciência, segurança e conexão</strong>.
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-[#9b0300] mb-6">
            Preparamos um encontro íntimo, com apenas 10 vagas.
          </h3>
          <p className="text-base mb-8">
            As vagas são limitadas para mantermos uma experiência cuidadosa. Garanta o seu lugar e do seu parceiro(a) nessa jornada!
          </p>
          
          <div className="flex flex-wrap gap-4 items-center font-bold text-sm mb-8 border-t border-[#9b0300] pt-4 w-full md:w-auto">
            <span className="flex items-center gap-2 border-l border-[#9b0300] pl-2">VIVÊNCIA PROFUNDA</span>
            <span className="flex items-center gap-2 border-l border-[#9b0300] pl-2">APENAS 10 VAGAS</span>
            <span className="flex items-center gap-2 border-l border-[#9b0300] pl-2">GESTANTES E CASAIS</span>
          </div>

          <Link 
            href="https://ericavilarpsi.com.br/pagamento-imersao" 
            className="w-full md:w-auto text-center bg-[#9b0300] hover:bg-[#610b07] text-white font-bold py-4 px-8 rounded-2xl transition duration-300 shadow-lg"
          >
            GARANTIR MINHA VAGA
          </Link>
        </div>

        {/* Hero Image - Lembre-se de colocar uma imagem relacionada à gestação na sua pasta /public */}
        <div className="w-full md:w-1/2 relative h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-xl">
          <Image 
            src="/erica-live.png" // <-- Atualize para a foto real do evento
            alt="Imersão Gestação Sem Filtro" 
            fill
            className="object-cover bg-gray-200"
            priority
          />
        </div>
      </section>

      {/* SECTION: Benefícios / O que oferecemos */}
      <section className="w-full bg-[#ececec] py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden shadow-md">
            <Image 
              src="/erica-live.png" // <-- Atualize para a foto real do evento
              alt="Ambiente acolhedor" 
              fill
              className="object-cover bg-gray-300"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-2xl font-bold text-[#9b0300] mb-4">Pensado para oferecer a você:</h3>
            <ul className="text-lg leading-relaxed space-y-4 font-medium">
              <li>🤍 Muito acolhimento em um ambiente seguro</li>
              <li>☕ Coffee break especial</li>
              <li>📖 Aprendizado profundo com profissionais reunidas em um só lugar</li>
              <li>🧘‍♀️ Exercícios para cada fase do trabalho de parto</li>
              <li>🤝 Orientações para que o companheiro seja um aliado presente nessa jornada</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION: Valores e Avisos */}
      <section className="w-full py-16 px-6 relative">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-8">Valores da Imersão:</h2>
            <ul className="space-y-6">
              <li className="flex items-center gap-3 text-xl bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-2xl">👩</span>
                <p><strong className="text-[#9b0300]">Individual:</strong> R$ 197</p>
              </li>
              <li className="flex items-center gap-3 text-xl bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-2xl">👩‍❤️‍👨</span>
                <p><strong className="text-[#9b0300]">Casal:</strong> R$ 297</p>
              </li>
              <li className="flex items-start gap-3 mt-6 p-5 bg-red-50 rounded-xl border border-red-100">
                <span className="text-xl mt-1">📌</span>
                <p className="text-sm md:text-base text-red-900 leading-relaxed">
                  <strong>Importante:</strong> após o pagamento, envie o comprovante lá no grupo ou no nosso privado para confirmarmos oficialmente a sua vaga.
                </p>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/2 relative min-h-[350px] rounded-xl overflow-hidden shadow-lg border border-gray-100 hidden md:block">
             <Image 
              src="/erica-live.png" // <-- Atualize para a foto real do evento
              alt="Casais na imersão" 
              fill
              className="object-cover bg-gray-200"
            />
          </div>
        </div>
      </section>

      {/* SECTION: Faixa CTA */}
      <section className="w-full bg-[#9b0300] text-white py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl font-bold mb-6">
            Para reservar sua vaga, basta entrar no link abaixo e selecionar a opção Pix ou Cartão de Crédito.
          </p>
          <Link 
            href="https://ericavilarpsi.com.br/pagamento-imersao" 
            className="inline-block bg-white text-[#9b0300] hover:bg-gray-100 font-bold py-4 px-10 rounded-2xl transition duration-300 shadow-md text-lg"
          >
            GARANTIR MINHA VAGA AGORA
          </Link>
        </div>
      </section>

    </main>
  );
}