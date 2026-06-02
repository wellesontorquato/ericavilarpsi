import { meses, semanas } from "@/lib/supervisao/format";
import { anosDisponiveis } from "@/lib/supervisao/dashboardUtils";

export default function DashboardFilters({ filters, setFilters, lancamentos, extraFilters }) {
  const anos = anosDisponiveis(lancamentos);

  function update(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="supervisao-filters compact dashboard-filters">
      <label>
        <span>Ano</span>
        <select value={filters.ano} onChange={(event) => update("ano", event.target.value)}>
          <option value="">Todos</option>
          {anos.map((ano) => <option key={ano} value={ano}>{ano}</option>)}
        </select>
      </label>
      <label>
        <span>Mês</span>
        <select value={filters.mes} onChange={(event) => update("mes", event.target.value)}>
          <option value="">Todos</option>
          {meses.map((mes) => <option key={mes.value} value={mes.value}>{mes.label}</option>)}
        </select>
      </label>
      <label>
        <span>Semana</span>
        <select value={filters.semana} onChange={(event) => update("semana", event.target.value)}>
          <option value="">Todas</option>
          {semanas.map((semana) => <option key={semana.value} value={semana.value}>{semana.label}</option>)}
        </select>
      </label>
      {extraFilters}
    </div>
  );
}
