export class TrespasserRoll extends Roll {

	

	//If DC is passed, we evaluate the roll against a DC
	async evaluate() {
		return await super.evaluate();
	}
}
