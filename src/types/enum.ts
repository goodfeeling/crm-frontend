export enum BasicStatus {
	DISABLE = 0,
	ENABLE = 1,
}

export enum ResultEnum {
	SUCCESS = 0,
	ERROR = -1,
	TIMEOUT = 401,
}

export enum StorageEnum {
	UserInfo = "userInfo",
	UserToken = "userToken",
	Settings = "settings",
	Nav = "nav",
	I18N = "i18nextLng",
	Menu = "menu",
	Role = "role",
}

export enum ThemeMode {
	Light = "light",
	Dark = "dark",
}

export enum ThemeLayout {
	Vertical = "vertical",
	Horizontal = "horizontal",
	Mini = "mini",
}

export enum ThemeColorPresets {
	Default = "default",
	Cyan = "cyan",
	Purple = "purple",
	Blue = "blue",
	Orange = "orange",
	Red = "red",
}

export enum LocalEnum {
	en_US = "en_US",
	zh_CN = "zh_CN",
}

export enum MultiTabOperation {
	FULLSCREEN = "fullscreen",
	REFRESH = "refresh",
	CLOSE = "close",
	CLOSEOTHERS = "closeOthers",
	CLOSEALL = "closeAll",
	CLOSELEFT = "closeLeft",
	CLOSERIGHT = "closeRight",
}

export enum PermissionType {
	CATALOGUE = 0,
	MENU = 1,
	BUTTON = 2,
}

export enum HtmlDataAttribute {
	ColorPalette = "data-color-palette",
	ThemeMode = "data-theme-mode",
}

export enum SortDirection {
	SortASC = "asc",
	SortDesc = "desc",
}
export enum Methods {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
	OPTIONS = "OPTIONS",
	PATCH = "PATCH",
	HEAD = "HEAD",
}
