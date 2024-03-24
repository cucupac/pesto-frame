/** @jsxImportSource frog/jsx */

import { Button, Frog, parseEther } from "frog";
import { handle } from "frog/vercel";
import pestoBowlAbi from "./pestoBowlAbi.json";
import { getBaseUrl } from "@/app/lib";
import { PinataFDK } from "pinata-fdk";

const fdk = new PinataFDK({
	pinata_jwt:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMWZjZTFiNS1iZTQwLTQ2ZjEtYmRmMy1iM2Q5NjgyOGEzZjAiLCJlbWFpbCI6ImN1Y3VwYWMxOTk2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1OThkN2UwZWQzNzM0ZTgyZTUzYSIsInNjb3BlZEtleVNlY3JldCI6ImZjMjA5Y2RmN2RiMGUwZjU2MzM1YTQ3NTgzZjNhY2ZhYWUyYjMxNjJiNDM3ZDQ0NDc2NTc3NWI1NzkyN2ZhYzAiLCJpYXQiOjE3MTEyMjM5ODJ9.IvqVP12t0JF7QCdx1hb7PDCZ25xwthNwpNoRDlkfBIk",
	pinata_gateway: "amber-far-gazelle-427.mypinata.cloud",
});

type State = {
	base: "basil" | "beet" | "carrot" | "tomato" | undefined;
	pasta: "spaghetti" | "bowtie" | "fettuccine" | "penne" | undefined;
	topping1: "parmesan" | "pine" | "pecorino" | "jalapeno" | undefined;
	topping2: "parmesan" | "pine" | "pecorino" | "jalapeno" | undefined;
	openAiJobId: string | undefined;
	ipfsUri: string | undefined;
	ipfsGatewayUrl: string | undefined;
};

const app = new Frog<{ State: State }>({
	basePath: "/api",
	initialState: {
		pasta: undefined,
		base: undefined,
		topping1: undefined,
		topping2: undefined,
		openAiJobId: undefined,
		ipfsUri: undefined,
		ipfsGatewayUrl: undefined,
	},
});

app.frame("/", (c) => {
	return c.res({
		action: "/choose-pasta",
		image: "https://purple-actual-aardwolf-413.mypinata.cloud/ipfs/Qmbk2Bi22YjohqR4f423WUxcxcApy8uVuuup3NwPLCSWNV",
		intents: [
			<Button value="basil">Basil</Button>,
			<Button value="tomato">Sun-dried Tomato</Button>,
			<Button value="beet">Beet</Button>,
			<Button value="carrot">Carrot</Button>,
		],
	});
});

app.use("/choose-pasta", fdk.analyticsMiddleware({ frameId: "choose-pasta" }));

app.frame("/choose-pasta", (c) => {
	const { buttonValue, deriveState } = c;
	const state = deriveState((previousState) => {
		previousState.base = buttonValue as State["base"];
	});

	return c.res({
		action: "/choose-topping1",
		image: "https://purple-actual-aardwolf-413.mypinata.cloud/ipfs/Qmbh4mhmqsjjNBLKSfRT4NaF3khBSaptatdDuyy6WJkwho",
		intents: [
			<Button value="spaghetti">Spaghetti</Button>,
			<Button value="bowtie">Bowtie</Button>,
			<Button value="penne">Penne</Button>,
			<Button value="fettuccine">Fettuccine</Button>,
		],
	});
});

app.use(
	"/choose-topping1",
	fdk.analyticsMiddleware({ frameId: "choose-topping1" })
);

app.frame("/choose-topping1", (c) => {
	const { buttonValue, deriveState } = c;
	const state = deriveState((previousState) => {
		previousState.pasta = buttonValue as State["pasta"];
	});

	return c.res({
		action: "/choose-topping2",
		image: "https://purple-actual-aardwolf-413.mypinata.cloud/ipfs/QmW8jHgkquVTewkXghLZBFbZFTqw9JQD9cQLyiA59Ji6NY",
		intents: [
			<Button value="parmesan">Parmesan</Button>,
			<Button value="pine">Pine Nuts</Button>,
			<Button value="pecorino">Pecorino Romano</Button>,
			<Button value="jalapeno">Jalapeno</Button>,
		],
	});
});

app.use(
	"/choose-topping2",
	fdk.analyticsMiddleware({ frameId: "choose-topping2" })
);

app.frame("/choose-topping2", (c) => {
	const { buttonValue, deriveState } = c;
	const state = deriveState((previousState) => {
		previousState.topping1 = buttonValue as State["topping1"];
	});

	return c.res({
		action: "/prepare-img",
		image: "https://purple-actual-aardwolf-413.mypinata.cloud/ipfs/QmeH7MX6qavbuRu1eAAnSQzHdhQ3o2XaVkagLzNs82HEi7",
		intents: [
			<Button value="parmesan">Parmesan</Button>,
			<Button value="pine">Pine Nuts</Button>,
			<Button value="pecorino">Pecorino Romano</Button>,
			<Button value="jalapeno">Jalapeno</Button>,
		],
	});
});

app.use("/prepare-img", fdk.analyticsMiddleware({ frameId: "prepare-img" }));

app.frame("/prepare-img", async (c) => {
	const { buttonValue, deriveState } = c;
	let state = await deriveState(async (previousState) => {
		previousState.topping2 = buttonValue as State["topping2"];
	});

	// invoke /api/img/create
	const url = getBaseUrl() + "api/image/create-job";

	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			base: state.base!,
			pasta: state.pasta,
			topping1: state.topping1,
			topping2: state.topping2,
		}),
	});

	const { jobId } = await response.json();
	// const jobId = "uuid-1234-5678-91011-12131415161718"

	// save jobId to state
	state = await deriveState(async (previousState) => {
		previousState.openAiJobId = jobId as State["openAiJobId"];
	});

	return c.res({
		action: "/refresh-img",
		image: (
			<div
				style={{
					color: "white",
					display: "flex",
					flexWrap: "wrap",
					fontSize: 55,
					background:
						"linear-gradient(to right, #334d2e, #598556, #3b5738)",
					height: "100%",
					width: "100%",
					padding: "30px",
				}}
			>
				<p style={{ whiteSpace: "normal" }}>
					Ready to cook your {state.base} {state.pasta} with{" "}
					{state.topping1} and {state.topping2} pesto?
				</p>
			</div>
		),
		intents: [<Button value="refresh">Create Image</Button>],
	});
});

app.use("/refresh-img", fdk.analyticsMiddleware({ frameId: "prepare-img" }));

app.frame("/refresh-img", async (c) => {
	const { deriveState } = c;
	const state = deriveState((previousState) => {});

	const url = getBaseUrl() + "api/image/query-job?jobId=" + state.openAiJobId;
	const response = await fetch(url);

	const { status, openAiUrl } = await response.json();
	if (status === "ready") {
		// get ipfs uri and gateway url using pinata fdk
		const ipfsGatewayUrl = await fdk.convertUrlToIPFS(openAiUrl);
		const cid = ipfsGatewayUrl!.split("/ipfs/")[1];
		const ipfsUri = `ipfs://${cid}`;

		// save ipfs uri and gateway url to state
		let state = await deriveState(async (previousState) => {
			previousState.ipfsUri = ipfsUri as State["ipfsUri"];
		});
		state = await deriveState(async (previousState) => {
			previousState.ipfsGatewayUrl =
				ipfsGatewayUrl as State["ipfsGatewayUrl"];
		});

		return c.res({
			action: "/mint-successful",
			image: ipfsGatewayUrl || "default-image-url",
			intents: [
				<Button.Transaction target={`/mint/${cid}`}>
					Mint
				</Button.Transaction>,
			],
		});
	} else {
		return c.res({
			action: "/refresh-img",
			image: (
				<div
					style={{
						color: "white",
						display: "flex",
						flexWrap: "wrap",
						fontSize: 55,
						background:
							"linear-gradient(to right, #334d2e, #598556, #3b5738)",
						height: "100%",
						width: "100%",
						padding: "30px",
					}}
				>
					<p style={{ whiteSpace: "normal" }}>
						Cooking up your {state.base} {state.pasta} with{" "}
						{state.topping1} and {state.topping2} pesto.
						<br />
						<br />
					</p>
					<p>Check the status to see if it's ready to mint!</p>
				</div>
			),
			intents: [<Button value="refresh">Status Check</Button>],
		});
	}
});

app.use(
	"/mint-successful",
	fdk.analyticsMiddleware({ frameId: "mint-successful" })
);

app.frame("/mint-successful", (c) => {
	const { deriveState } = c;
	const state = deriveState((previousState) => {});

	return c.res({
		image: state.ipfsGatewayUrl || "default-image-url",
		imageAspectRatio: "1:1",
		intents: [
			<span style={{ color: "green", fontWeight: "bold" }}>
				Mint was successful!
			</span>,
		],
	});
});

app.transaction("/mint/:cid", (c) => {
	// Access the path parameter
	const cid = c.req.param("cid");
	const ipfsUri = `ipfs://${cid}`;

	// Call contract with IPFS URI as paramater
	return c.contract({
		abi: pestoBowlAbi,
		chainId: "eip155:84532", // base sepolia
		functionName: "mint",
		to: "0xCA43892A4a06E78b01C47ba84f07D6b97d96F938", // our deployed contract address
		args: [ipfsUri],
		value: parseEther("0.000001"),
	});
});

export const GET = handle(app);
export const POST = handle(app);
