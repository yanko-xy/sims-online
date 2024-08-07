import {
	ContactShadows,
	Environment,
	Grid,
	OrbitControls,
	useCursor,
} from "@react-three/drei";
import { AnimatedWeman } from "./AnimatedWoman";
import { useAtom } from "jotai";
import { charactersAtom, mapAtom, socket, userAtom } from "./SocketManager";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Item } from "./Item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "../hooks/useGrid";
import { buildModeAtom, draggedItemAtom, draggedItemRotationAtom } from "./UI";

export const Experience = () => {
	const [buildMode, setBuildMode] = useAtom(buildModeAtom);

	const [characters] = useAtom(charactersAtom);
	const [map] = useAtom(mapAtom);
	const [items, setItems] = useState(map.items);
	const [onFloor, setOnFloor] = useState(false);
	useCursor(onFloor);
	const { vector3ToGrid, gridToVector3 } = useGrid();

	const scence = useThree((state) => state.scene);
	const [user] = useAtom(userAtom);

	const onPlaneClicked = (e) => {
		if (!buildMode) {
			const character = scence.getObjectByName(`character-${user}`);
			if (!character) {
				return;
			}
			socket.emit(
				"move",
				vector3ToGrid(character.position),
				vector3ToGrid(e.point)
			);
		} else {
			if (draggedItem !== null) {
				if (canDrop) {
					setItems((prev) => {
						const newItems = [...prev];
						newItems[draggedItem].gridPosition = vector3ToGrid(
							e.point
						);
						newItems[draggedItem].rotation = draggedItemRotation;
						return newItems;
					});

					setDraggedItem(null);
				}
			}
		}
	};

	const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
	const [draggedItemRotation, setDraggedItemRotation] = useAtom(
		draggedItemRotationAtom
	);
	const [dragPosition, setDragPosition] = useState(null);
	const [canDrop, setCanDrop] = useState(false);

	useEffect(() => {
		if (draggedItem === null) {
			return;
		}
		const item = items[draggedItem];
		const width =
			item.rotation === 1 || item.rotation === 3
				? item.size[1]
				: item.size[0];
		const height =
			item.rotation === 1 || item.rotation === 3
				? item.size[0]
				: item.size[1];

		let dropable = true;

		// check if item is in bounds
		if (
			dragPosition[0] < 0 ||
			dragPosition[0] + width > map.size[0] * map.gridDivision
		) {
			dropable = false;
		}
		if (
			dragPosition[1] < 0 ||
			dragPosition[1] + height > map.size[1] * map.gridDivision
		) {
			dropable = false;
		}

		// check if item is not colliding with other items
		if (!item.walkable && !item.wall) {
			items.forEach((otherItem, idx) => {
				// ignore self
				if (draggedItem == idx) {
					return;
				}

				// ignore wall  & floor
				if (otherItem.walkable || otherItem.wall) {
					return;
				}

				// check item overlap
				const otherWidth =
					otherItem.roation === 1 || otherItem.roation === 3
						? otherItem.size[1]
						: otherItem.size[0];
				const otherHight =
					otherItem.roation === 1 || otherItem.roation === 3
						? otherItem.size[0]
						: otherItem.size[1];
				if (
					dragPosition[0] < otherItem.gridPosition[0] + otherWidth &&
					dragPosition[0] + width > otherItem.gridPosition[0] &&
					dragPosition[1] < otherItem.gridPosition[1] + otherHight &&
					dragPosition[1] + height > otherItem.gridPosition[1]
				) {
					dropable = false;
				}
			});
		}

		setCanDrop(dropable);
	}, [dragPosition, draggedItem, items]);

	const controls = useRef();
	const state = useThree((state) => state);

	useEffect(() => {
		if (buildMode) {
			setItems(map.items || []);
			state.camera.position.set(8, 8, 8);
			controls.current.target.set(0, 0, 0);
		} else {
			socket.emit("itemsUpdate", items);
		}
	}, [buildMode]);
	return (
		<>
			<Environment preset="sunset" />
			<ambientLight intensity={0.3} />
			{/* <ContactShadows blur={2} /> */}
			<OrbitControls
				ref={controls}
				minDistance={5}
				maxDistance={20}
				minPolarAngle={0}
				maxPolarAngle={Math.PI / 2}
				screenSpacePanning={false}
			/>

			{(buildMode ? items : map.items).map((item, idx) => (
				<Item
					key={`${item.name}-${idx}`}
					item={item}
					onClick={() => {
						if (buildMode) {
							setDraggedItem((prev) =>
								prev === null ? idx : prev
							);
							setDraggedItemRotation(item.rotation || 0);
						}
					}}
					isDragging={draggedItem === idx}
					dragPosition={dragPosition}
					dragRotation={draggedItemRotation}
					canDrop={canDrop}
				/>
			))}

			<mesh
				rotation-x={-Math.PI / 2}
				position-y={-0.001}
				onClick={onPlaneClicked}
				onPointerEnter={() => setOnFloor(true)}
				onPointerLeave={() => setOnFloor(false)}
				onPointerMove={(e) => {
					if (!buildMode) {
						return;
					}
					const newPosition = vector3ToGrid(e.point);
					if (
						!dragPosition ||
						newPosition[0] !== dragPosition[0] ||
						newPosition[1] !== dragPosition[1]
					) {
						setDragPosition(newPosition);
					}
				}}
				position-x={map.size[0] / 2}
				position-z={map.size[1] / 2}
			>
				<planeGeometry args={map.size} />
				<meshStandardMaterial color="#f0f0f0" />
			</mesh>

			<Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
			{!buildMode &&
				characters.map((character) => (
					<AnimatedWeman
						key={character.id}
						id={character.id}
						path={character.path}
						position={gridToVector3(character.position)}
						hairColor={character.hairColor}
						topColor={character.topColor}
						bottomColor={character.bottomColor}
					/>
				))}
		</>
	);
};
