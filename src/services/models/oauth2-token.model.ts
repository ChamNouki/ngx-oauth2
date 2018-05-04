import * as moment from 'moment';

export class OAuth2Token {

  public accessToken?: string;
  public state?: string;
  public tokenType?: string;
  public expiresIn?: number;
  public receivedAt: moment.Moment;

  constructor(params: Map<string, string>) {
    this.accessToken = params.get('access_token');
    this.state = params.get('state');
    this.tokenType = params.get('token_type');
    this.expiresIn = Number(params.get('expires_in'));
    this.receivedAt = moment.utc();
  }

  public isValid(): boolean {
    if ( this.receivedAt && this.expiresIn ) {
      return this.accessToken != null && this.receivedAt.add(this.expiresIn, 'seconds').isAfter(moment.utc());
    }
    return false;
  }

  public getAuthorization(): string {
    return `${this.tokenType} ${this.accessToken}`;
  }
}
