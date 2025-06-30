import React, { useState } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
	const [previewImage, setPreviewImage] = useState(null);
	const [errorMsg, setErrorMsg] = useState('');
	const [dragActive, setDragActive] = useState(false);

	// File validation constants
	const MAX_SIZE = 5 * 1024 * 1024; // 5MB
	const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];

	const checkFileValid = (file) => {
		if (file.size > MAX_SIZE) {
			return 'File size must be less than 5MB';
		}
		
		let typeAllowed = false;
		for (let i = 0; i < ALLOWED_TYPES.length; i++) {
			if (ALLOWED_TYPES[i] === file.type) {
				typeAllowed = true;
				break;
			}
		}
		
		if (!typeAllowed) {
			return 'File type not supported. Please upload images, PDF, or text files.';
		}
		
		return null;
	};

	const handleFileProcess = (file) => {
		const validationErr = checkFileValid(file);
		if (validationErr) {
			setErrorMsg(validationErr);
			return;
		}

		setErrorMsg('');

		// Show image preview if it's an image file
		if (file.type.indexOf('image/') === 0) {
			setPreviewImage(URL.createObjectURL(file));
		} else {
			setPreviewImage(null);
		}

		// Convert file to base64 for storage
		const reader = new FileReader();
		reader.readAsDataURL(file);
		
		reader.onload = () => {
			// send file data back to parent component
			onFileUpload({
				name: file.name,
				url: reader.result // base64 encoded data
			});
		};
		
		reader.onerror = () => {
			setErrorMsg('Error reading file. Please try again.');
		};
	};

	const onFileInputChange = (e) => {
		const selectedFile = e.target.files[0];
		if (!selectedFile) return;
		handleFileProcess(selectedFile);
	};

	const onDragOver = (e) => {
		e.preventDefault();
		setDragActive(true);
	};

	const onDragLeave = (e) => {
		e.preventDefault();
		setDragActive(false);
	};

	const onFileDrop = (e) => {
		e.preventDefault();
		setDragActive(false);
		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile) {
			handleFileProcess(droppedFile);
		}
	};

	return (
		<div className="w-full">
			<div
				className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
					dragActive
						? 'border-blue-500 bg-blue-50'
						: 'border-gray-300 hover:border-gray-400'
				}`}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onFileDrop}
			>
				<input
					type="file"
					onChange={onFileInputChange}
					className="hidden"
					id="file-upload"
					accept=".jpg,.jpeg,.png,.gif,.pdf,.txt"
				/>
				<label htmlFor="file-upload" className="cursor-pointer">
					<Upload className="mx-auto h-12 w-12 text-gray-400" />
					<p className="mt-2 text-sm text-gray-600">
						<span className="font-medium text-blue-600 hover:text-blue-500">
							Click to upload
						</span>{' '}
						or drag and drop
					</p>
					<p className="text-xs text-gray-500">
						Images, PDF, TXT up to 5MB
					</p>
				</label>
			</div>

			{errorMsg && (
				<div className="mt-2 flex items-center text-red-600 text-sm">
					<AlertCircle className="h-4 w-4 mr-1" />
					{errorMsg}
				</div>
			)}

			{previewImage && (
				<div className="mt-4">
					<img src={previewImage} alt="Preview" className="h-32 w-auto border rounded" />
				</div>
			)}
		</div>
	);
};

export default FileUpload;