// ./src/App.tsx
import React, { useState, useEffect } from "react";
import Path from "path";
import deleteFileFromBlob, {
	displayblob,
	uploadFileToBlob,
	isStorageConfigured,
} from "./azure-storage-blob";
import "./App.css";
import BackupIcon from "@material-ui/icons/Backup";
import DescriptionIcon from '@material-ui/icons/Description';
const storageConfigured = isStorageConfigured();

const App = (): JSX.Element => {
	
	// all blobs in container
	const [blobList, setBlobList] = useState([]);
	const [checkedState, setCheckedState] = useState(
		new Array(blobList.length).fill(false)
	);
	useEffect(() => {
		var x = displayblob().then((z) => {
			setBlobList(z);
		});
		setCheckedState(new Array(blobList.length).fill(false));
	}, []);

	// current file to upload into container
	const [fileSelected, setFileSelected] = useState(null);

	// UI/form management

	const [del, setdel] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [inputKey, setInputKey] = useState(Math.random().toString(36));

	const onFileChange = (event: any) => {
		// capture file into state
		setFileSelected(event.target.files[0]);
	};

	const onFileUpload = async () => {
		// prepare UI
		setUploading(true);

		// *** UPLOAD TO AZURE STORAGE ***
		const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

		// prepare UI for results
		setBlobList(blobsInContainer);
		// reset state/form
		setFileSelected(null);
		setUploading(false);
		setInputKey(Math.random().toString(36));
	};
	//delete

	const onFileDelete = async () => {
		console.log("in delete")
		console.log(del)
		del.map((deletevalue) => {
			setUploading(true);
			const blobsInContainer: string[] = deleteFileFromBlob(deletevalue).then(
				(z) => {
					setBlobList(z);
				}
			);
			// prepare UI for results
			// reset state/form
			setFileSelected(null);
			setUploading(false);
			setInputKey(Math.random().toString(36));
		});
		setdel([]);
		setCheckedState(new Array(blobList.length).fill(false));
	};
	// display form
	const DisplayForm = () => (
		<div>
			<input
				className="form__input"
				type="file"
				onChange={onFileChange}
				key={inputKey || ""}
			/>
			<button className="form__submit" type="submit" onClick={onFileUpload}>
				<b>Upload</b>
			</button>
		</div>
	);
	function changecheckbox(pos,event) {
		console.log(checkedState);
		const updatedCheckedState = checkedState.map((item, index) =>
      		index === pos ? !item : item
    	);
		// console.log(updatedCheckedState);
		setCheckedState(updatedCheckedState);
		const x = new Array();
		blobList.map((value,index) => {
			// console.log(value + index);
			updatedCheckedState.map((boolstatus,i) => {
				// console.log(boolstatus + "of index" + i);
				if(boolstatus === true && i === index){
					// console.log("value selected" + value +" " + i);
					x.push(value.substring(67));
					// console.log(value);
				}
			})
		})
		// setdel((oldval) => [event]);
		// console.log(x);
		setdel(x);
	}
	// display file name and image
	var i = 0;
	const DisplayImagesFromContainer = () => (
		<div>
			<ol>
				{blobList.map((item , index) => {
					return (
						<li key={item}>
							<div className="filenamelist">
								{Path.basename(item)}
								<input
									type="checkbox"
									id="chkbox"
									name="chkbox"
									value={item}
									checked={checkedState[index]}
									onChange={() => {
										// changecheckbox(Path.basename(item));
										changecheckbox(index,Path.basename(item));
									}}
								/>
								<br/>
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);

	return (
		<div className="rootelement">
			<div className="container">
				<div>
					<h1>Welcome! Azure Blob Storage</h1>
					<hr className="line" />
				</div>
			</div>
			<div className="body__container">
				<div className="body__leftalign">
					<div className="filecount">
						<h2>Number of files in blob: {blobList.length}</h2>
					</div>
					<div className="fileload">
						{storageConfigured && !uploading && DisplayForm()}
						{storageConfigured && uploading && (
							<div className="fileload__dynamic">
								<p className="fileload__dynamic__text">Uploading File</p>
								<BackupIcon className="cloudicon"></BackupIcon>
							</div>
						)}
					</div>
				</div>
				<div className="body__rightalign">
					<div className="filelist">
						<h2>List of Files from Blob container <DescriptionIcon></DescriptionIcon></h2>
						{storageConfigured &&
							blobList.length > 0 &&
							DisplayImagesFromContainer()}
						{!storageConfigured && <div>Storage is not configured.</div>}
					</div>
					<button className="form__del" type="submit" onClick={onFileDelete}>
						<b>Delete</b>
					</button>
				</div>
			</div>
		</div>
	);
};

export default App;
