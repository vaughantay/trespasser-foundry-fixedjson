import { TRESPASSER } from './helpers/config.mjs';
import { TrespasserActor } from './actor/actor.mjs';
import { TrespasserActorSheet } from './sheets/actor-sheet.mjs';
import { TrespasserItem } from './item/item.mjs';
import { TrespasserItemSheet } from './sheets/item-sheet.mjs';
import { SpellData } from './data_models/items/spell.mjs';
import { AdventurerData } from './data_models/adventurer.mjs';
import { loadHandlebarsPartials } from './helpers/preload.mjs'

Hooks.once('init', function () {

	game.trespasser = {
		TrespasserActor,
		TrespasserItem,
	};
	
	CONFIG.TRESPASSER = TRESPASSER;
	
	CONFIG.Actor.dataModels.adventurer = AdventurerData;
	CONFIG.Actor.documentClass = TrespasserActor;

	CONFIG.Item.dataModels.spell = SpellData;

	Actors.unregisterSheet('core', ActorSheet);
	Actors.registerSheet('trespasser', TrespasserActorSheet, {
		makeDefault: true,
		label: 'TRESPASSER.SheetLabels.Actor',
	});
	
	Items.unregisterSheet('core', ItemSheet);
	Items.registerSheet('trespasser', TrespasserItemSheet, {
		makeDefault: true,
		label: 'TRESPASSER.SheetLabels.Item',
	});

	loadHandlebarsPartials();

});
