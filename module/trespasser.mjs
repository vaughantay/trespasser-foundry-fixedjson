import { TRESPASSER } from './helpers/config.mjs';
import { TrespasserActor } from './actor/actor.mjs';
import { TrespasserActorSheet } from './sheets/actor-sheet.mjs';
import { AdventurerData } from './data_models/adventurer.mjs';
import { loadHandlebarsPartials } from './helpers/preload.mjs'

async function preloadHandlebarTemplates(){
	const templatePaths = [
		"systems/trespasser/templates/actor/adventurer/skills-tab.hbs",
		"systems/trespasser/templates/actor/adventurer/equip-tab.hbs",
		"systems/trespasser/templates/actor/adventurer/combat-tab.hbs"
	];
	return loadTemplates(templatePaths);
};


Hooks.once('init', function () {

	game.trespasser = {
		TrespasserActor,
	};

	CONFIG.TRESPASSER = TRESPASSER;

	CONFIG.Actor.dataModels.adventurer = AdventurerData;

	CONFIG.Actor.documentClass = TrespasserActor;

	Actors.unregisterSheet('core', ActorSheet);
	Actors.registerSheet('trespasser', TrespasserActorSheet, {
		makeDefault: true,
		label: 'TRESPASSER.SheetLabels.Actor',
	});

	preloadHandlebarTemplates();
});
