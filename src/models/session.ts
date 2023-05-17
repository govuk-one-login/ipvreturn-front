import {EnvironmentVariables} from "../utils/environmentVariables";

export class Session {

    constructor(state:string ) {
        this.state =state;
        this.expiryDate = Math.floor(Date.now() / 1000) + EnvironmentVariables.getSessionTtl();
    }

    state: string
    expiryDate: number
}
