import type { GetProp, TableProps } from "antd";
import type { SorterResult } from "antd/es/table/interface";

export type ColumnsType<T extends object = object> = TableProps<T>["columns"];
export type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
export interface TableParams {
	pagination?: TablePaginationConfig;
	sortField?: SorterResult<any>["field"];
	sortOrder?: SorterResult<any>["order"];
	filters?: Parameters<GetProp<TableProps, "onChange">>[1];
	searchParams?: { [key: string]: any };
}
export interface PageList<T> {
	list: T[];
	total: number;
	page: number;
	page_size: number;
	total_page: number;
	filters?: DataFilters;
}

type StringMapOfStringArray = { [key: string]: string[] };
interface DataRangeFilter {
	field: string;
	start: string;
	end: string;
}
interface DataFilters {
	likeFilters: StringMapOfStringArray;
	matches: StringMapOfStringArray;
	dataRanges: DataRangeFilter[] | null;
	sortBy: string[];
	sortDirection: string;
	page: number;
	pageSize: number;
}

export interface UserToken {
	accessToken?: string;
	refreshToken?: string;
	expirationAccessDateTime?: string;
	expirationRefreshDateTime?: string;
}

export interface UserInfo {
	id: number;
	email: string;
	user_name: string;
	nick_name: string;
	header_img: string;
	phone: string;
	status?: boolean;
	created_at: string;
	updated_at: string;
	current_role?: Role;
	roles?: Role[];
}

export interface UpdateUser {
	email: string;
	user_name: string;
	nick_name: string;
	header_img: string;
	phone: string;
	status?: boolean;
}

export interface Role {
	id: number;
	parent_id: number;
	name: string;
	label: string;
	status: boolean;
	order?: number;
	description?: string;
	created_at: string;
	updated_at: string;
	default_router: string;
	children?: Role[];
	path: number[];
}

export interface RoleTree {
	value: string;
	title: string;
	key: string;
	children: RoleTree[];
	path: number[];
}

export interface Upload {
	id: string;
	file_name: string;
	file_path: string;
	file_md5: string;
	file_url: string;
}

export interface Operation {
	id: number;
	name: string;
	path: string;
	ip: string;
	method: string;
	latency: number;
	agent: string;
	error_message: string;
	body: string;
	status: number;
	created_at: string;
	updated_at: string;
}

export interface Api {
	id: number;
	path: string;
	api_group: string;
	method: string;
	description: string;
	created_at: string;
	updated_at: string;
}

export interface ApiGroup {
	api_group: { [key: string]: any };
	groups: string[];
}

export interface ApiGroupItem {
	title: string;
	key: string;
	children: ApiGroupItem[];
}

export interface Dictionary {
	id: number;
	name: string;
	type: string;
	status: number;
	desc: string;
	created_at: string;
	updated_at: string;
}

export interface DictionaryDetail {
	id: number;
	label: string;
	value: string;
	extend: string;
	status: number;
	sort: number;
	sys_dictionary_Id: number | null;
	created_at: string;
	updated_at: string;
}

export interface Menu {
	id: number;
	menu_level: number;
	parent_id: number;
	name: string;
	path: string;
	hidden: boolean;
	component: string;
	sort: number;
	active_name: string;
	keep_alive: number;
	default_menu: number;
	title: string;
	icon: string;
	close_tab: number;
	menu_group_id: number;
	created_at: string;
	updated_at: string;
	level: number[];
	children?: Menu[];
	menu_btns?: MenuBtn[];
	menu_parameters?: MenuParameter[];
	btn_slice?: string[];
}

export interface MenuTree {
	value: string;
	title: string;
	key: string;
	origin?: Menu;
	children: MenuTree[];
	path: number[];
}

export interface roleSetting {
	role_menus: { [key: string]: number[] };
	role_apis: string[];
	role_btns: { [key: string]: number[] };
}

export interface MenuGroup {
	id: number;
	name: string;
	path: string;
	status: boolean;
	sort: number;
	created_at: string;
	updated_at: string;
}

export interface MenuTreeUserGroup {
	id: number;
	name: string;
	path: string;
	items: Menu[];
}

export interface MenuBtn {
	id?: number;
	name: string;
	desc: string;
	sys_base_menu_id: number;
}

export interface MenuParameter {
	id?: number;
	type: string;
	key: string;
	value: string;
	sys_base_menu_id: number;
}
export type PasswordEditReq = {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
};
