import { getUserJwt } from "./netlifyIdentity";

const BASE_URL = "/.netlify/functions/supervisao-api";

export async function supervisaoRequest(user, resource, options = {}) {
  const token = await getUserJwt(user);
  const params = new URLSearchParams({ resource });

  if (options.id) {
    params.set("id", options.id);
  }

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || "Não foi possível concluir a solicitação.");
  }

  return payload;
}

export async function listResource(user, resource, params) {
  const payload = await supervisaoRequest(user, resource, { params });
  return payload.items || [];
}

export async function createResource(user, resource, data) {
  const payload = await supervisaoRequest(user, resource, {
    method: "POST",
    body: data,
  });

  return payload.item;
}

export async function updateResource(user, resource, id, data) {
  const payload = await supervisaoRequest(user, resource, {
    method: "PUT",
    id,
    body: data,
  });

  return payload.item;
}

export async function archiveResource(user, resource, id) {
  return updateResource(user, resource, id, {
    arquivado: true,
    statusRegistro: "Arquivado",
    arquivadoEm: new Date().toISOString(),
  });
}

export async function restoreResource(user, resource, id) {
  return updateResource(user, resource, id, {
    arquivado: false,
    statusRegistro: "Ativo",
    restauradoEm: new Date().toISOString(),
  });
}

export async function deleteResource(user, resource, id) {
  return supervisaoRequest(user, resource, {
    method: "DELETE",
    id,
  });
}
