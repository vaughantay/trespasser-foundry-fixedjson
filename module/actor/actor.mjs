export class TrespasserActor extends Actor {
	prepareBaseData() {
		super.prepareBaseData();
	}

	async _preCreate(data, options, user) {
		await super._preCreate(data,options,user);
		if (data.type === 'adventurer') {
			const prototypeToken = {
				sight: {enabled: true},
				actorLink: true
			};
			return this.updateSource({prototypeToken});
		}
	}
}
