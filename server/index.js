import Pathfinding from "pathfinding";
import { Server } from "socket.io";

const io = new Server({
	cors: {
		origin: "*",
	},
});

io.listen(3001);

const characters = [];

const items = {
	table: {
		name: "Table",
		size: [3, 6],
	},
	chair: {
		name: "Chair",
		size: [2, 2],
	},
	chair1: {
		name: "Chair1",
		size: [2, 2],
	},
	couchSmall: {
		name: "CouchSmall",
		size: [3, 2],
	},
	stepCubbyStorage: {
		name: "StepCubbyStorage",
		size: [4, 2],
	},
	couch: {
		name: "Couch",
		size: [5, 4],
	},
	breakathtub: {
		name: "Bathtub",
		size: [6, 3],
	},
	bathroomCabinetDrawer: {
		name: "BathroomCabinetDrawer",
		size: [3, 2],
	},
	bathroomSink: {
		name: "BathroomSink",
		size: [2, 2],
	},
	bathroomMirror: {
		name: "BathroomMirror",
		size: [2, 1],
		wall: true,
	},
	bear: {
		name: "Bear",
		size: [1, 1],
		wall: true,
	},
	bedDouble: {
		name: "BedDouble",
		size: [5, 6],
	},
	bedSingle: {
		name: "BedSingle",
		size: [3, 6],
	},
	bench: {
		name: "Bench",
		size: [3, 2],
	},
	bookcaseClosed: {
		name: "BookcaseClosed",
		size: [2, 1],
	},
	bookcaseClosedWide: {
		name: "BookcaseClosedWide",
		size: [3, 1],
	},
	bookcaseOpen: {
		name: "BookcaseOpen",
		size: [2, 1],
	},
	bookcaseOpenLow: {
		name: "BookcaseOpenLow",
		size: [2, 1],
	},
	babinetBed: {
		name: "CabinetBed",
		size: [2, 2],
	},
	cabinetBedDrawer: {
		name: "CabinetBedDrawer",
		size: [2, 2],
	},
	cabinetBedDrawerTable: {
		name: "CabinetBedDrawerTable",
		size: [2, 2],
	},
	coffeeTable: {
		name: "CoffeeTable",
		size: [4, 2],
	},
	kitchenBar: {
		name: "KitchenBar",
		size: [3, 2],
	},
	kitchenFridge: {
		name: "KitchenFridge",
		size: [2, 2],
	},
	kitchenFridgeBuiltIn: {
		name: "KitchenFridgeBuiltIn",
		size: [2, 2],
	},
	kitchenCabinetCornerInner: {
		name: "KitchenCabinetCornerInner",
		size: [2, 2],
	},
	kitchenCabinetCornerRound: {
		name: "KitchenCabinetCornerRound",
		size: [2, 2],
	},
	kitchenCabinetDrawer: {
		name: "KitchenCabinetDrawer",
		size: [2, 2],
	},
	kitchenStove: {
		name: "KitchenStove",
		size: [2, 2],
	},
	kitchenCabinetUpper: {
		name: "KitchenCabinetUpper",
		size: [2, 1],
		wall: true,
	},
	kitchenCabinetUpperCorner: {
		name: "KitchenCabinetUpperCorner",
		size: [1, 1],
		wall: true,
	},
	kitchenCabinetUpperDouble: {
		name: "KitchenCabinetUpperDouble",
		size: [2, 1],
		wall: true,
	},
	kitchenCabinetUpperLow: {
		name: "KitchenCabinetUpperLow",
		size: [2, 1],
		wall: true,
	},
	kitchenFridgeLarge: {
		name: "KitchenFridgeLarge",
		size: [3, 2],
	},
	loungeDesignSofaCorner: {
		name: "LoungeDesignSofaCorner",
		size: [7, 7],
	},
	rugRectangle: {
		name: "RugRectangle",
		size: [5, 3],
		walkable: true,
	},
	stoolBar: {
		name: "StoolBar",
		size: [1, 1],
	},
	tableRound: {
		name: "TableRound",
		size: [5, 5],
	},
	toilet: {
		name: "Toilet",
		size: [2, 2],
	},
	toiletSquare: {
		name: "ToiletSquare",
		size: [2, 2],
	},
	washer: {
		name: "Washer",
		size: [2, 2],
	},
};

const map = {
	size: [20, 10],
	gridDivision: 2,
	items: [
		{
			...items.chair,
			gridPosition: [12, 10],
			rotation: 3,
		},
		{
			...items.chair,
			gridPosition: [7, 10],
			rotation: 1,
		},
		{
			...items.table,
			gridPosition: [9, 9],
		},
		{
			...items.couch,
			gridPosition: [4, 4],
		},
		{
			...items.stepCubbyStorage,
			gridPosition: [10, 5],
		},
		{
			...items.breakathtub,
			gridPosition: [34, 0],
			rotation: 2,
		},
		{
			...items.toiletSquare,
			gridPosition: [20, 10],
			rotation: 2,
		},
		{
			...items.loungeDesignSofaCorner,
			gridPosition: [30, 10],
		},
		{
			...items.coffeeTable,
			gridPosition: [33, 11],
		},
		{
			...items.rugRectangle,
			gridPosition: [20, 14],
		},
		{
			...items.bathroomCabinetDrawer,
			gridPosition: [20, 0],
			rotation: 2,
		},
		{
			...items.bathroomMirror,
			gridPosition: [20.5, 0],
			rotation: 2,
		},
		{
			...items.bear,
			gridPosition: [16, 0],
			rotation: 2,
		},
		{
			...items.kitchenCabinetCornerInner,
			gridPosition: [0, 6],
			rotation: 3,
		},
		{
			...items.kitchenCabinetDrawer,
			gridPosition: [0, 8],
			rotation: 3,
		},
		{
			...items.kitchenStove,
			gridPosition: [0, 10],
			rotation: 3,
		},
		{
			...items.kitchenCabinetDrawer,
			gridPosition: [0, 12],
			rotation: 3,
		},
		{
			...items.kitchenCabinetCornerRound,
			gridPosition: [0, 14],
			rotation: 3,
		},
		{
			...items.kitchenCabinetUpper,
			gridPosition: [0, 8],
			rotation: 3,
		},
		{
			...items.kitchenCabinetUpperDouble,
			gridPosition: [0, 10],
			rotation: 3,
		},
		{
			...items.kitchenCabinetUpper,
			gridPosition: [0, 12],
			rotation: 3,
		},
		{
			...items.kitchenCabinetUpperCorner,
			gridPosition: [0, 14],
			rotation: 3,
		},
	],
};

const grid = new Pathfinding.Grid(
	map.size[0] * map.gridDivision,
	map.size[1] * map.gridDivision
);

const finder = new Pathfinding.AStarFinder({
	allowDiagonal: true,
	dontCrossCorners: true,
});

const findPath = (start, end) => {
	const gridClone = grid.clone();
	const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
	return path;
};

const updateGrid = () => {
	map.items.forEach((item) => {
		if (item.wall || item.walkable) {
			return;
		}
		const width =
			item.rotation === 1 || item.rotation === 3
				? item.size[1]
				: item.size[0];
		const height =
			item.rotation === 1 || item.rotation === 3
				? item.size[0]
				: item.size[1];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				grid.setWalkableAt(
					item.gridPosition[0] + x,
					item.gridPosition[1] + y,
					false
				);
			}
		}
	});
};

updateGrid();

const generateRandomPosition = () => {
	while (true) {
		const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
		const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);
		if (grid.isWalkableAt(x, y)) {
			return [x, y];
		}
	}
};

const generateRandomHexColor = () => {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
	console.log("user conneted");

	characters.push({
		id: socket.id,
		position: generateRandomPosition(),
		hairColor: generateRandomHexColor(),
		topColor: generateRandomHexColor(),
		bottomColor: generateRandomHexColor(),
	});

	socket.emit("hello", {
		map,
		characters,
		id: socket.id,
		items,
	});

	io.emit("characters", characters);

	socket.on("move", (from, to) => {
		const character = characters.find(
			(character) => character.id == socket.id
		);
		const path = findPath(from, to);
		if (!path) {
			return;
		}

		character.position = from;
		character.path = path;
		io.emit("playerMove", character);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");

		characters.splice(
			characters.findIndex((character) => character.id == socket.id),
			1
		);
		io.emit("characters", characters);
	});
});
