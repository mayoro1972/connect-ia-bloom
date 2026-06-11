import { invokeAdminEdgeFunction } from "@/lib/content-admin";
import type {
  ApprovePackRequest,
  ApprovePackResponse,
  GeneratePackRequest,
  GeneratePackResponse,
  HealthCheckResponse,
  ListProvidersResponse,
  RegeneratePackRequest,
  RegeneratePackResponse,
  RejectPackRequest,
  RejectPackResponse,
  SendPackRequest,
  SendPackResponse,
  TestProviderRequest,
  TestProviderResponse,
} from "@/components/backoffice/prospecting/types";

export const PROSPECTING_ADMIN_FUNCTION = "prospecting-admin";

export type ProspectingAdminAction =
  | "generate_pack"
  | "regenerate_pack"
  | "approve_pack"
  | "reject_pack"
  | "send_pack"
  | "test_provider"
  | "list_providers"
  | "health_check";

type ProspectingAdminEnvelope<TPayload extends Record<string, unknown> | undefined = Record<string, unknown>> = {
  action: ProspectingAdminAction;
  payload?: TPayload;
};

async function invokeProspectingAdmin<TResponse, TPayload extends Record<string, unknown> | undefined = Record<string, unknown>>(
  token: string,
  envelope: ProspectingAdminEnvelope<TPayload>,
): Promise<TResponse> {
  return invokeAdminEdgeFunction<TResponse>(token, PROSPECTING_ADMIN_FUNCTION, envelope as Record<string, unknown>);
}

export async function generateProspectPack(
  token: string,
  payload: GeneratePackRequest,
): Promise<GeneratePackResponse> {
  return invokeProspectingAdmin<GeneratePackResponse, GeneratePackRequest>(token, {
    action: "generate_pack",
    payload,
  });
}

export async function regenerateProspectPack(
  token: string,
  payload: RegeneratePackRequest,
): Promise<RegeneratePackResponse> {
  return invokeProspectingAdmin<RegeneratePackResponse, RegeneratePackRequest>(token, {
    action: "regenerate_pack",
    payload,
  });
}

export async function approveProspectPack(
  token: string,
  payload: ApprovePackRequest,
): Promise<ApprovePackResponse> {
  return invokeProspectingAdmin<ApprovePackResponse, ApprovePackRequest>(token, {
    action: "approve_pack",
    payload,
  });
}

export async function rejectProspectPack(
  token: string,
  payload: RejectPackRequest,
): Promise<RejectPackResponse> {
  return invokeProspectingAdmin<RejectPackResponse, RejectPackRequest>(token, {
    action: "reject_pack",
    payload,
  });
}

export async function sendProspectPack(
  token: string,
  payload: SendPackRequest,
): Promise<SendPackResponse> {
  return invokeProspectingAdmin<SendPackResponse, SendPackRequest>(token, {
    action: "send_pack",
    payload,
  });
}

export async function testProspectingProvider(
  token: string,
  payload: TestProviderRequest,
): Promise<TestProviderResponse> {
  return invokeProspectingAdmin<TestProviderResponse, TestProviderRequest>(token, {
    action: "test_provider",
    payload,
  });
}

export async function listProspectingProviders(token: string): Promise<ListProvidersResponse> {
  return invokeProspectingAdmin<ListProvidersResponse>(token, {
    action: "list_providers",
  });
}

export async function getProspectingHealth(token: string): Promise<HealthCheckResponse> {
  return invokeProspectingAdmin<HealthCheckResponse>(token, {
    action: "health_check",
  });
}
