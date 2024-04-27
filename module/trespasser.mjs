import { TRESPASSER } from './helpers/config.mjs';
import { TrespasserActor } from './actor/actor.mjs';
import { TrespasserActorSheet } from './sheets/actor-sheet.mjs';
import { AdventurerData } from './module/data_models/adventurer.mjs';

Hooks.once('init', function () {

	game.trespasser = {
		
	};
	
	CONFIG.Actor.dataModels.adventurer = AdventurerData;

});
