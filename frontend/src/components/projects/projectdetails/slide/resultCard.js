import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

const inputToString = (inputs) => {
	const entries = Object.entries(inputs);
	const pretty = entries.map(([key, value]) => {
		return " " + key + " = " + String(value);
	});
	return pretty.join();
};

const showResults = (output, inputs, model, nameMapper) => {
	if (output === "") {
		return <p> ~~choose your inputs~~ </p>;
	} else {
		return (
			<p>
				Given these inputs of
				<span style={{ color: "green" }}>
					{inputToString(inputs)}
				</span>{" "}
				your selected model of
				<span style={{ color: "blue" }}>
					{model === ""
						? " NO MODEL SELECTED "
						: " " + nameMapper(model)}
				</span>{" "}
				would predict it to be:{" "}
				<span style={{ color: "red" }}>{output.data}</span>
			</p>
		);
	}
};

const loader = (loading, output, inputs, model, nameMapper) => {
	if (loading) {
		return (
			<div className="container center">
				<CircularProgress />
			</div>
		);
	} else {
		return (
			<div>
				<span className="card-title center">
					{output ? output.data : ""}
				</span>
				<span style={{ textAlign: "center" }}>
					{showResults(output, inputs, model, nameMapper)}
				</span>
			</div>
		);
	}
};

const ResultCard = (uid, project, model, inputs, nameMapper) => {
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (model !== "") {
			const path = {
				uid,
				project: project.title,
				model,
				inputs: Object.values(inputs)
			};
			setLoading(true);
			// console.log("BEFORE AXIOS, LOADING", loading);
			axios
				.post(`https://flask-api-aomh7gr2xq-ue.a.run.app/predict`, path)
				.then((res) => {
					console.log("THIS IS RESULT", res);
					setOutput(res);
					setLoading(false);
				})
				.catch((err) => {
					//console.log("THIS IS AN ERROR", err);
					setOutput("Sorry there are some errors with are server.");
					setLoading(false);
				});
		} else {
			setOutput("error, please choose a model first");
		}

		// console.log("EXIT AXIOS LOADING STATE,", loading);
	};

	return (
		<div className="results">
			<div className="col s3">
				<div className="card z-depth-0">
					<div className="card-content">
						<span className="card-title">Result:</span>
						<div className="center">
							<button
								className="btn waves-effect waves-light blue"
								type="submit"
								name="action"
								onClick={handleSubmit}
							>
								Predict!
								<i className="material-icons right">cached</i>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="col s9">
				<div className="card z-depth-0">
					<div className="card-content">
						{loader(loading, output, inputs, model, nameMapper)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResultCard;
