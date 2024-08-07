import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { mapAtom, SocketManager } from "./components/SocketManager";
import { useAtom } from "jotai";
import { UI } from "./components/UI";

function App() {
	const [map] = useAtom(mapAtom);
	return (
		<>
			<SocketManager />
			<Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
				<color attach="background" args={["#ececec"]} />
				{map && <Experience />}
			</Canvas>
			<UI />
		</>
	);
}

export default App;
