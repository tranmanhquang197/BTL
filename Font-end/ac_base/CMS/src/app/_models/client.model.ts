export class ClientModel {
  clientId: string | undefined;
  resourceIds: string | undefined;
  clientSecret: string | undefined;
  scope: string | undefined;
  authorizedGrantTypes: string | undefined;
  webServerRedirectUri: string | undefined;
  authorities: string | undefined;
  accessTokenValidity: number | undefined;
  refreshTokenValidity: number | undefined;
  additionalInformation: string | undefined;
  autoapprove: string | undefined;
}
