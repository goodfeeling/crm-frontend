import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";

import { Icon } from "@/components/icon";
import { useMenuBtn, useMenuBtnActions } from "@/store/menuBtnStore";
import { useMenuParameter, useMenuParameterActions } from "@/store/menuParameterStore";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import type { GetRef, InputRef, TableProps } from "antd";
import { Form, Input, InputNumber, Table } from "antd";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { MenuBtn, MenuParameter } from "#/entity";
export type SettingType = {
	id: number;
};

export type SettingModalProps = {
	formValue: SettingType;
	title: string;
	show: boolean;
	onCancel: VoidFunction;
};

export default function UserModal({ title, show, formValue, onCancel }: SettingModalProps) {
	const { id } = formValue;
	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent className="sm:max-w-5xl max-h-[80vh] overflow-y-auto  scrollbar-hide">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<ParameterPage MenuId={id} />
				<BtnPage MenuId={id} />
			</DialogContent>
		</Dialog>
	);
}

// 定义 cellType 类型
type CellType = "input" | "select" | "number";
type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
	index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

interface EditableCellMenuBtnProps {
	title: React.ReactNode;
	editable: boolean;
	dataIndex: keyof MenuParameter;
	record: MenuParameter;
	handleSave: (record: MenuParameter) => void;
	cellType: CellType;
}

function ParameterPage({ MenuId }: { MenuId: number }) {
	const { updateOrCreateMenu, deleteMenu, fetchMenu } = useMenuParameterActions();
	const menuParameterData = useMenuParameter();

	const EditableCell: React.FC<React.PropsWithChildren<EditableCellMenuBtnProps>> = ({
		cellType,
		title,
		editable,
		children,
		dataIndex,
		record,
		handleSave,
		...restProps
	}) => {
		const [editing, setEditing] = useState(false);
		const inputRef = useRef<InputRef>(null);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const form = useContext(EditableContext)!;

		useEffect(() => {
			if (editing) {
				inputRef.current?.focus();
			}
		}, [editing]);

		const toggleEdit = () => {
			setEditing(!editing);
			form.setFieldsValue({ [dataIndex]: record[dataIndex] });
		};

		const save = async () => {
			try {
				const values = await form.validateFields();
				toggleEdit();
				handleSave({ ...record, ...values });
			} catch (errInfo) {
				console.log("Save failed:", errInfo);
			}
		};
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let inputNode;

		// 根据 type 字段的值来选择不同的输入组件
		switch (cellType) {
			case "select":
				inputNode = (
					<Select
						onValueChange={(value) => {
							form.setFieldsValue({ [dataIndex]: value });
							save();
						}}
						value={form.getFieldValue(dataIndex)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="params">
								<Badge variant="success">params</Badge>
							</SelectItem>
							<SelectItem value="query">
								<Badge variant="error">query</Badge>
							</SelectItem>
						</SelectContent>
					</Select>
				);
				break;
			case "number":
				inputNode = <InputNumber style={{ width: "100%" }} onPressEnter={save} onBlur={save} />;
				break;
			default:
				inputNode = <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
		}

		let childNode = children;

		if (editable) {
			childNode = editing ? (
				<Form.Item
					style={{ margin: 0 }}
					name={dataIndex}
					rules={[{ required: true, message: `${title} is required.` }]}
				>
					{inputNode}
				</Form.Item>
			) : (
				<div className="editable-cell-value-wrap" style={{ paddingInlineEnd: 24 }} onClick={toggleEdit}>
					{children}
				</div>
			);
		}

		return <td {...restProps}>{childNode}</td>;
	};
	type ColumnTypes = Exclude<TableProps<MenuParameter>["columns"], undefined>;
	const [dataSource, setDataSource] = useState<MenuParameter[]>([]);

	useEffect(() => {
		fetchMenu(MenuId);
	}, [fetchMenu, MenuId]);

	useEffect(() => {
		setDataSource(menuParameterData);
	}, [menuParameterData]);
	const handleDelete = (id: number | undefined) => {
		if (!id) return;
		deleteMenu(id);
	};

	const defaultColumns: (ColumnTypes[number] & {
		editable?: boolean;
		dataIndex: string;
		cellType?: CellType;
	})[] = [
		{
			title: "类型",
			dataIndex: "type",
			width: "30%",
			editable: true,
			cellType: "select",
		},
		{
			title: "key",
			dataIndex: "key",
			editable: true,
		},
		{
			title: "value",
			dataIndex: "value",
			editable: true,
		},
		{
			title: "operation",
			dataIndex: "operation",
			render: (_, record) =>
				dataSource.length >= 1 ? (
					<Button variant="linkwarning" size="icon" onClick={() => handleDelete(record.id)}>
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
						<span>删除</span>
					</Button>
				) : null,
		},
	];

	const handleAdd = () => {
		const newData: MenuParameter = {
			key: "new",
			type: "params",
			value: "string",
			sys_base_menu_id: MenuId,
		};
		updateOrCreateMenu(newData);
	};

	const handleSave = (row: MenuParameter) => {
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.id === item.id);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});
		updateOrCreateMenu(row);
		setDataSource(newData);
	};

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	const columns = defaultColumns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: MenuParameter) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave,
				cellType: col.cellType || "input", // 默认使用 'input'
			}),
		};
	});
	return (
		<Card>
			<CardHeader>
				<CardTitle>菜单参数设置</CardTitle>
				<div className="flex items-start justify-start">
					<Button onClick={handleAdd} type="button">
						<Icon icon="solar:add-circle-outline" size={18} />
						Add a row
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				<Table<MenuParameter>
					rowKey={(record) => record.id as number}
					components={components}
					rowClassName={() => "editable-row"}
					bordered
					dataSource={dataSource}
					columns={columns as ColumnTypes}
					pagination={false}
				/>
			</CardContent>
		</Card>
	);
}
interface EditableCellMenuParameterProps {
	title: React.ReactNode;
	editable: boolean;
	dataIndex: keyof MenuParameter;
	record: MenuParameter;
	handleSave: (record: MenuParameter) => void;
}
function BtnPage({ MenuId }: { MenuId: number }) {
	const { updateOrCreateMenu, deleteMenu, fetchMenu } = useMenuBtnActions();
	const menuBtnData = useMenuBtn();

	const EditableCell: React.FC<React.PropsWithChildren<EditableCellMenuParameterProps>> = ({
		title,
		editable,
		children,
		dataIndex,
		record,
		handleSave,
		...restProps
	}) => {
		const [editing, setEditing] = useState(false);
		const inputRef = useRef<InputRef>(null);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const form = useContext(EditableContext)!;

		useEffect(() => {
			if (editing) {
				inputRef.current?.focus();
			}
		}, [editing]);

		const toggleEdit = () => {
			setEditing(!editing);
			form.setFieldsValue({ [dataIndex]: record[dataIndex] });
		};

		const save = async () => {
			try {
				const values = await form.validateFields();

				toggleEdit();
				handleSave({ ...record, ...values });
			} catch (errInfo) {
				console.log("Save failed:", errInfo);
			}
		};
		let childNode = children;

		if (editable) {
			childNode = editing ? (
				<Form.Item
					style={{ margin: 0 }}
					name={dataIndex}
					rules={[{ required: true, message: `${title} is required.` }]}
				>
					<Input ref={inputRef} defaultValue={record?.value?.toString()} onPressEnter={save} onBlur={save} />
				</Form.Item>
			) : (
				<div className="editable-cell-value-wrap" style={{ paddingInlineEnd: 24 }} onClick={toggleEdit}>
					{children}
				</div>
			);
		}

		return <td {...restProps}>{childNode}</td>;
	};
	type ColumnTypes = Exclude<TableProps<MenuBtn>["columns"], undefined>;
	const [dataSource, setDataSource] = useState<MenuBtn[]>([]);

	useEffect(() => {
		fetchMenu(MenuId);
	}, [fetchMenu, MenuId]);

	useEffect(() => {
		setDataSource(menuBtnData);
	}, [menuBtnData]);
	const handleDelete = (id: number | undefined) => {
		if (!id) return;
		deleteMenu(id);
	};

	const defaultColumns: (ColumnTypes[number] & {
		editable?: boolean;
		dataIndex: string;
		cellType?: CellType;
	})[] = [
		{
			title: "name",
			dataIndex: "name",
			width: "30%",
			editable: true,
		},
		{
			title: "desc",
			dataIndex: "desc",
			editable: true,
		},
		{
			title: "operation",
			dataIndex: "operation",
			render: (_, record) =>
				dataSource.length >= 1 ? (
					<Button variant="linkwarning" size="icon" onClick={() => handleDelete(record.id)}>
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
						<span>删除</span>
					</Button>
				) : null,
		},
	];

	const handleAdd = () => {
		const newData: MenuBtn = {
			name: "New data",
			desc: "New data",
			sys_base_menu_id: MenuId,
		};
		updateOrCreateMenu(newData);
	};

	const handleSave = (row: MenuBtn) => {
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.id === item.id);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});
		updateOrCreateMenu(row);
	};

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	const columns = defaultColumns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: MenuBtn) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave,
			}),
		};
	});
	return (
		<Card>
			<CardHeader>
				<CardTitle>可控按钮设置</CardTitle>
				<div className="flex items-start justify-start">
					<Button onClick={handleAdd} variant="default">
						<Icon icon="solar:add-circle-outline" size={18} />
						Add a row
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				<Table<MenuBtn>
					rowKey={(record) => record.id as number}
					components={components}
					rowClassName={() => "editable-row"}
					bordered
					dataSource={dataSource}
					columns={columns as ColumnTypes}
					pagination={false}
				/>
			</CardContent>
		</Card>
	);
}
