import { Card, CardContent, CardHeader } from "@/ui/card";
import { useMemo, useState } from "react";
import ControlPanel from "../../control-panel";
import ContainerView from "./container";
import Toolbar from "./toolbar";

const variantKey = [
	{
		type: "slide in",
		values: ["slideInUp", "slideInDown", "slideInLeft", "slideInRight"],
	},
	{
		type: "slide out",
		values: ["slideOutUp", "slideOutDown", "slideOutLeft", "slideOutRight"],
	},
	{
		type: "fade in",
		values: ["fadeIn", "fadeInUp", "fadeInDown", "fadeInLeft", "fadeInRight"],
	},
	{
		type: "fade out",
		values: ["fadeOut", "fadeOutUp", "fadeOutDown", "fadeOutLeft", "fadeOutRight"],
	},
	{
		type: "zoom in",
		values: ["zoomIn", "zoomInUp", "zoomInDown", "zoomInLeft", "zoomInRight"],
	},
	{
		type: "zoom out",
		values: ["zoomOut", "zoomOutUp", "zoomOutDown", "zoomOutLeft", "zoomOutRight"],
	},
	{
		type: "bounce in",
		values: ["bounceIn", "bounceInUp", "bounceInDown", "bounceInLeft", "bounceInRight"],
	},
	{
		type: "bounce out",
		values: ["bounceOut", "bounceOutUp", "bounceOutDown", "bounceOutLeft", "bounceOutRight"],
	},
	{
		type: "flip in",
		values: ["flipInX", "flipInY"],
	},
	{
		type: "flip out",
		values: ["flipOutX", "flipOutY"],
	},
	{
		type: "scale in",
		values: ["scaleInX", "scaleInY"],
	},
	{
		type: "scale out",
		values: ["scaleOutX", "scaleOutY"],
	},
	{
		type: "rotate in",
		values: ["rotateIn"],
	},
	{
		type: "rotate out",
		values: ["rotateOut"],
	},
];

export default function Inview() {
	const defaultValue = useMemo(() => {
		return {
			isText: false,
			isMulti: false,
			selectedVariant: "slideInUp",
		};
	}, []);

	const [isText, setIsText] = useState(defaultValue.isText);
	const [isMulti, setIsMulti] = useState(defaultValue.isMulti);

	const [selectedVariant, setSelectedVariant] = useState(defaultValue.selectedVariant);

	const onRefresh = () => {
		setIsText(defaultValue.isText);
		setIsMulti(defaultValue.isMulti);
		setSelectedVariant(defaultValue.selectedVariant);
	};

	return (
		<Card>
			<CardHeader>
				<Toolbar
					isText={isText}
					onChnageText={() => setIsText(!isText)}
					isMulti={isMulti}
					onChangeMulti={() => setIsMulti(!isMulti)}
					onRefresh={onRefresh}
				/>
			</CardHeader>
			<CardContent>
				<div className="flex md:flex-row flex-col gap-2">
					<div className="flex-3">
						<ContainerView variant={selectedVariant} isText={isText} isMulti={isMulti} />
					</div>
					<div className="flex-1">
						<ControlPanel
							variantKey={variantKey}
							selectedVariant={selectedVariant}
							onChangeVarient={(varient) => setSelectedVariant(varient)}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
