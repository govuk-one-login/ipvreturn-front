import { EnvironmentVariables } from "../utils/EnvironmentVariables";

export class Session {

	constructor(state:string ) {
		this.state = state;
		this.expiryDate = Math.floor(Date.now() / 1000) + EnvironmentVariables.getSessionTtlInSecs();
	}

    state: string;

    expiryDate: number;

}
