import type { Cursinho } from '../../types';

interface Props {
  cursinho: Cursinho;
}

export function CourseCard({ cursinho }: Props) {
  return (
    <article className="text-sm max-w-xs font-sans">
      <header className="mb-2">
        <h2 className="font-bold text-base text-gray-800">{cursinho.nome || 'Nome não disponível'}</h2>
        <p className="text-gray-500 text-xs">{cursinho.regiao || 'Região não disponível'}</p>
      </header>

      <div className="space-y-1 text-gray-700">
        <p><span className="font-semibold">Endereço:</span> {cursinho.enderecoCompleto || 'Não disponível'}</p>
        <p><span className="font-semibold">Horário:</span> {cursinho.horario || 'Não disponível'}</p>
        <p><span className="font-semibold">Processo Seletivo:</span> {cursinho.temProcessoSeletivo || 'Não informado'}</p>
        <p><span className="font-semibold">Modalidade Remota:</span> {cursinho.modalidadeRemota || 'Não informado'}</p>
        <p><span className="font-semibold">Vagas Presenciais:</span> {cursinho.vagasDisponiveisPresencial ?? 'Não informado'}</p>
        <p><span className="font-semibold">Vagas Remotas:</span> {cursinho.vagasDisponiveisRemoto ?? 'Não informado'}</p>
        <p><span className="font-semibold">Contato:</span> {cursinho.telefone || 'Não disponível'}</p>
        <p><span className="font-semibold">E-mail:</span> {cursinho.email || 'Não disponível'}</p>
        {cursinho.observacoes && (
          <p><span className="font-semibold">Observação:</span> {cursinho.observacoes}</p>
        )}
      </div>

      <footer className="mt-2 space-y-1">
        {cursinho.urlSite && (
          <p>
            <span className="font-semibold">Site: </span>
            <a href={cursinho.urlSite} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">
              {cursinho.urlSite}
            </a>
          </p>
        )}
        {cursinho.urlFacebook && (
          <p>
            <a href={cursinho.urlFacebook} target="_blank" rel="noreferrer" className="text-blue-700 underline">
              Acessar Facebook
            </a>
          </p>
        )}
        {cursinho.urlInstagram && (
          <p>
            <a href={cursinho.urlInstagram} target="_blank" rel="noreferrer" className="text-pink-600 underline">
              Acessar Instagram
            </a>
          </p>
        )}
      </footer>
    </article>
  );
}
