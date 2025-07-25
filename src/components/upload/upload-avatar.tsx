import { Icon } from "@/components/icon";
import { themeVars } from "@/theme/theme.css";
import { Text } from "@/ui/typography";
import { fBytes } from "@/utils/format-number";
import { Upload } from "antd";
import type { UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { useEffect, useState } from "react";
import { StyledUploadAvatar } from "./styles";
import { beforeAvatarUpload } from "./utils";

interface Props extends UploadProps {
	defaultAvatar?: string;
	helperText?: React.ReactElement | string;
	onHeaderImgChange?: (url: string) => void;
}
export function UploadAvatar({ helperText, onHeaderImgChange, defaultAvatar = "", ...other }: Props) {
	const [imageUrl, setImageUrl] = useState<string>(defaultAvatar);

	useEffect(() => {
		setImageUrl(defaultAvatar);
	}, [defaultAvatar]);
	const [isHover, setIsHover] = useState(false);
	const handelHover = (hover: boolean) => {
		setIsHover(hover);
	};

	const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
		console.log("status", info.file.status);
		if (info.file.status === "uploading") {
			return;
		}
		if (info.file.status === "done" || info.file.status === "error") {
			if (info.file.response?.status === 200) {
				// change headerImage
				if (onHeaderImgChange) {
					onHeaderImgChange(info.file.response?.data.file_url);
				}
				setImageUrl(info.file.response?.data.file_url);
			}
		}
	};

	const renderPreview = <img src={imageUrl} alt="" className="absolute rounded-full" />;

	const renderPlaceholder = (
		<div
			style={{
				backgroundColor: !imageUrl || isHover ? themeVars.colors.background.neutral : "transparent",
			}}
			className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
		>
			<Icon icon="solar:camera-add-bold" size={32} />
			<div className="mt-1 text-xs">Upload Photo</div>
		</div>
	);

	const renderContent = (
		<div
			className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
			onMouseEnter={() => handelHover(true)}
			onMouseLeave={() => handelHover(false)}
		>
			{imageUrl ? renderPreview : null}
			{!imageUrl || isHover ? renderPlaceholder : null}
		</div>
	);

	const defaultHelperText = (
		<Text variant="caption" color="secondary">
			Allowed *.jpeg, *.jpg, *.png, *.gif
			<br /> max size of {fBytes(3145728)}
		</Text>
	);
	const renderHelpText = <div className="text-center">{helperText || defaultHelperText}</div>;

	return (
		<StyledUploadAvatar>
			<Upload
				name="file"
				showUploadList={false}
				listType="picture-circle"
				className="avatar-uploader flex! items-center justify-center"
				{...other}
				beforeUpload={beforeAvatarUpload}
				onChange={handleChange}
			>
				{renderContent}
			</Upload>
			{renderHelpText}
		</StyledUploadAvatar>
	);
}
