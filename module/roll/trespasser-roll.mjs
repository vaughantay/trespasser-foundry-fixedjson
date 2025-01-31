export class TrespasserRoll extends Roll {

	constructor(formula, DC = -1, data = {}, options = {}) {
		super(formula, data, options);

		this.DC = DC;


		console.log(DC);
	}

	//If DC is passed, we evaluate the roll against a DC
	async evaluate() {
		const results = await super.evaluate();

		//-1 Just means there is no DC.
		if (this.DC != -1) {
			this.success = results._total > this.DC ? true : false;
			this.successvalue = Math.floor((results._total - this.dc) / 5);
		}

		console.log(results);
		return results;
	}

	async toMessage(messageData = {}, options = {}, extraText = '') {

		//We will override some message data to add content, and then pass it to super.
		const renderedRoll = await super.render(messageData, options);

		let extraContent = '';

		if (this.success !== undefined) {
			extraContent += await renderTemplate('systems/trespasser/templates/chat/against-dc.hbs', {success: this.success, DC: this.DC});
		}
		messageData.content = renderedRoll + extraContent;

		super.toMessage(messageData);

	}
}
