import cx from "classnames";
import type React from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { FaCheckSquare, FaMinusSquare, FaSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import "./styles.css";

const folder = {
	name: "",
	children: [
		{
			name: "Fruits",
			children: [
				{ name: "Avocados" },
				{ name: "Bananas" },
				{ name: "Berries" },
				{ name: "Oranges" },
				{ name: "Pears" },
			],
		},
		{
			name: "Drinks",
			children: [
				{ name: "Apple Juice" },
				{ name: "Chocolate" },
				{ name: "Coffee" },
				{
					name: "Tea",
					children: [{ name: "Black Tea" }, { name: "Green Tea" }, { name: "Red Tea" }, { name: "Matcha" }],
				},
			],
		},
		{
			name: "Vegetables",
			children: [{ name: "Beets" }, { name: "Carrots" }, { name: "Celery" }, { name: "Lettuce" }, { name: "Onions" }],
		},
	],
};

const data = flattenTree(folder);

function MultiSelectCheckbox() {
	return (
		<div>
			<div className="checkbox">
				<TreeView
					data={data}
					aria-label="Checkbox tree"
					multiSelect
					propagateSelect
					propagateSelectUpwards
					togglableSelect
					nodeRenderer={({
						element,
						isBranch,
						isExpanded,
						isSelected,
						isHalfSelected,
						getNodeProps,
						level,
						handleSelect,
						handleExpand,
					}) => {
						return (
							<div {...getNodeProps({ onClick: handleExpand })} style={{ marginLeft: 40 * (level - 1) }}>
								{isBranch && <ArrowIcon isOpen={isExpanded} />}
								<CheckBoxIcon
									className="checkbox-icon"
									onClick={(e: React.MouseEvent<SVGElement>) => {
										handleSelect(e);
										e.stopPropagation();
									}}
									variant={isHalfSelected ? "some" : isSelected ? "all" : "none"}
								/>
								<span className="name">{element.name}</span>
							</div>
						);
					}}
				/>
			</div>
		</div>
	);
}

const ArrowIcon = ({
	isOpen,
	className,
}: {
	isOpen: boolean;
	className?: string;
}) => {
	const baseClass = "arrow";
	const classes = cx(baseClass, { [`${baseClass}--closed`]: !isOpen }, { [`${baseClass}--open`]: isOpen }, className);
	return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({
	variant,
	...rest
}: {
	variant: string;
	className?: string;
	onClick?: (e: React.MouseEvent<SVGElement>) => void;
}) => {
	switch (variant) {
		case "all":
			return <FaCheckSquare {...rest} />;
		case "none":
			return <FaSquare {...rest} />;
		case "some":
			return <FaMinusSquare {...rest} />;
		default:
			return null;
	}
};

export default MultiSelectCheckbox;
