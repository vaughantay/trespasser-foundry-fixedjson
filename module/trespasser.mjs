import { TRESPASSER } from './helpers/config.mjs';
import { AdventurerData } from './module/data_models/adventurer.mjs';

Hooks.once('init', function () {

	game.trespasser = {
		
	};
	
	CONFIG.Actor.dataModels.adventurer = AdventurerData;

});
