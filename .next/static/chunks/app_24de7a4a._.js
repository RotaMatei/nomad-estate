(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/enums.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RoleEnum",
    ()=>RoleEnum
]);
var RoleEnum = /*#__PURE__*/ function(RoleEnum) {
    RoleEnum["INVESTOR"] = "INVESTOR";
    RoleEnum["MODERATOR"] = "MODERATOR";
    RoleEnum["ADMIN"] = "ADMIN";
    return RoleEnum;
}({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: 'https://api.nomadestatehub.com',
    withCredentials: true
});
// Attach Authorization header automatically if a token exists
api.interceptors.request.use((config)=>{
    try {
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('token') : "TURBOPACK unreachable";
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = "Bearer ".concat(token);
        }
    } catch (e) {}
    return config;
});
api.interceptors.response.use((response)=>response, async (error)=>{
    var _error_response;
    if (((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status) === 401) {
        try {
            console.log('Refreshing Token...');
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('https://api.nomadestatehub.com/refresh', {
                refreshToken: localStorage.getItem('refreshToken')
            }, {
                withCredentials: true
            });
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            console.log(data.accessToken, data.refreshToken);
            error.config.headers['Authorization'] = "Bearer ".concat(data.accessToken);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].request(error.config);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/utils/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomButton",
    ()=>CustomButton,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TouchAppOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/TouchAppOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/grey.js [app-client] (ecmascript) <export default as grey>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const CustomButton = (param)=>{
    let { color = 'primary', icon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TouchAppOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            color: '#fff'
        }
    }, void 0, false, {
        fileName: "[project]/app/components/utils/button.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)), label = '', onClick = ()=>{}, children = null, type = 'button', fullWidth = true, sx = {}, disabled = false, containerSx = {} } = param;
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const paletteSlot = theme.palette[color];
    const colorMain = paletteSlot.main;
    var _paletteSlot_dark;
    const colorHover = (_paletteSlot_dark = paletteSlot.dark) !== null && _paletteSlot_dark !== void 0 ? _paletteSlot_dark : paletteSlot.main;
    var _paletteSlot_light;
    const colorLight = (_paletteSlot_light = paletteSlot.light) !== null && _paletteSlot_light !== void 0 ? _paletteSlot_light : paletteSlot.main;
    // Ensure icon color matches disabled text color by overriding its sx when disabled
    const startIconEl = (()=>{
        if (disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(icon)) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: colorMain,
                    display: 'inline-flex'
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/components/utils/button.tsx",
                lineNumber: 42,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        }
        return icon;
    })();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            position: 'relative',
            display: fullWidth ? 'block' : 'inline-block',
            width: fullWidth ? '100%' : 'auto',
            ...containerSx
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
            onClick: onClick,
            "aria-label": label,
            type: type,
            fullWidth: fullWidth,
            startIcon: startIconEl,
            disabled: disabled,
            sx: {
                height: {
                    xs: 42,
                    md: 48
                },
                textTransform: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: {
                    xs: '12px',
                    md: '14px',
                    lg: '16px'
                },
                fontWeight: 700,
                color: '#fff',
                backgroundColor: colorMain,
                boxShadow: "0 3px 0 ".concat(colorLight),
                px: 3,
                borderRadius: {
                    xs: '12px',
                    lg: '16px'
                },
                justifyContent: 'center',
                '& .MuiButton-startIcon': {
                    mr: 1.5
                },
                '&:hover': {
                    backgroundColor: colorHover
                },
                '&:focus-visible': {
                    outline: "2px solid ".concat(colorMain),
                    outlineOffset: 2
                },
                // Disabled appearance: text/icon in page primary color, background same grey as disabled Autocomplete
                '&.Mui-disabled': {
                    color: colorMain,
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][200],
                    boxShadow: "0 3px 0 ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][300]),
                    opacity: 1
                },
                '&.Mui-disabled .MuiButton-startIcon': {
                    color: colorMain
                },
                ...sx
            },
            children: children !== null && children !== void 0 ? children : label
        }, void 0, false, {
            fileName: "[project]/app/components/utils/button.tsx",
            lineNumber: 49,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/utils/button.tsx",
        lineNumber: 48,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CustomButton, "VrMvFCCB9Haniz3VCRPNUiCauHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = CustomButton;
const __TURBOPACK__default__export__ = CustomButton;
var _c;
__turbopack_context__.k.register(_c, "CustomButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/reactDevBits/Globe/SpinningGlobe.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "globeRoot": "SpinningGlobe-module__EB0ZwW__globeRoot",
  "globeWrap": "SpinningGlobe-module__EB0ZwW__globeWrap",
});
}),
"[project]/app/reactDevBits/Globe/SpinningGlobe.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SpinningGlobe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__G__as__useLoader$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export G as useLoader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$PerspectiveCamera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/PerspectiveCamera.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/reactDevBits/Globe/SpinningGlobe.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function GlobeMesh(param) {
    let { landColor, waterColor, textureUrl = '/earth.png', autoRotate = true, autoRotateSpeed = 0.1, scale = 1, spinTrigger } = param;
    _s();
    const groupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const shouldSpinRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const spinTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const texture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__G__as__useLoader$3e$__["useLoader"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextureLoader"], textureUrl);
    // Ensure correct color space for PNGs with transparency
    texture.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    const safeLandColor = landColor || '#004080'; // fallback dark blue
    const safeWaterColor = waterColor || '#87CEEB'; // fallback light blue
    const landMaterial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GlobeMesh.useMemo[landMaterial]": ()=>{
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                color: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](safeLandColor),
                map: texture,
                transparent: true,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrontSide"],
                depthWrite: true
            });
        }
    }["GlobeMesh.useMemo[landMaterial]"], [
        texture,
        safeLandColor
    ]);
    const waterMaterial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GlobeMesh.useMemo[waterMaterial]": ()=>{
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                color: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](safeWaterColor),
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrontSide"]
            });
        }
    }["GlobeMesh.useMemo[waterMaterial]"], [
        safeWaterColor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "GlobeMesh.useFrame": (_, delta)=>{
            if (groupRef.current) {
                if (autoRotate) {
                    groupRef.current.rotation.y += autoRotateSpeed * delta;
                }
                if (shouldSpinRef.current) {
                    const spinSpeed = 1 / 0.75 * 2.5 * Math.sign(autoRotateSpeed);
                    groupRef.current.rotation.y += spinSpeed * delta;
                }
            }
        }
    }["GlobeMesh.useFrame"]);
    // Camera is configured via PerspectiveCamera in the Canvas
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobeMesh.useEffect": ()=>{
            if (spinTrigger == null || !groupRef.current || spinTimeoutRef.current) return;
            shouldSpinRef.current = true;
            spinTimeoutRef.current = window.setTimeout({
                "GlobeMesh.useEffect": ()=>{
                    shouldSpinRef.current = false;
                    spinTimeoutRef.current = null;
                }
            }["GlobeMesh.useEffect"], 800);
            return ({
                "GlobeMesh.useEffect": ()=>{
                    if (spinTimeoutRef.current) {
                        window.clearTimeout(spinTimeoutRef.current);
                        spinTimeoutRef.current = null;
                    }
                }
            })["GlobeMesh.useEffect"];
        }
    }["GlobeMesh.useEffect"], [
        spinTrigger
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        scale: scale,
        ref: groupRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.999,
                            64,
                            64
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                        object: waterMaterial,
                        attach: "material"
                    }, void 0, false, {
                        fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                renderOrder: 1,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            1.001,
                            64,
                            64
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                        object: landMaterial,
                        attach: "material"
                    }, void 0, false, {
                        fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_s(GlobeMesh, "PED76NPuMQjLtoQTCZgUSrmYjkI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__G__as__useLoader$3e$__["useLoader"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = GlobeMesh;
function SpinningGlobe(param) {
    let { landColor, waterColor, strokeColor, textureUrl = '/earth.png', autoRotate, autoRotateSpeed, scale = 1, className, style, pointerEvents = 'none', spinTrigger, align } = param;
    const size = 250 * scale;
    const alignmentStyle = align === 'right' ? {
        marginLeft: 'auto',
        marginRight: 0
    } : align === 'left' ? {
        marginLeft: 0,
        marginRight: 'auto'
    } : {
        margin: '0 auto'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].globeWrap, " ").concat(className !== null && className !== void 0 ? className : ''),
        style: {
            width: "".concat(size, "px"),
            height: "".concat(size, "px"),
            pointerEvents,
            ...alignmentStyle,
            ...style
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$PerspectiveCamera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"], {
                    makeDefault: true,
                    position: [
                        0,
                        0,
                        2.5
                    ],
                    fov: 50,
                    near: 0.1,
                    far: 100
                }, void 0, false, {
                    fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                    intensity: 0.5
                }, void 0, false, {
                    fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                    lineNumber: 146,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                    position: [
                        5,
                        5,
                        5
                    ],
                    intensity: 1
                }, void 0, false, {
                    fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GlobeMesh, {
                    landColor: landColor,
                    waterColor: waterColor,
                    strokeColor: strokeColor,
                    textureUrl: textureUrl,
                    autoRotate: autoRotate,
                    autoRotateSpeed: autoRotateSpeed,
                    scale: 1,
                    spinTrigger: spinTrigger
                }, void 0, false, {
                    fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
                    enableZoom: false,
                    enablePan: false,
                    enableRotate: false
                }, void 0, false, {
                    fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
            lineNumber: 144,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/reactDevBits/Globe/SpinningGlobe.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
_c1 = SpinningGlobe;
var _c, _c1;
__turbopack_context__.k.register(_c, "GlobeMesh");
__turbopack_context__.k.register(_c1, "SpinningGlobe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/register/chooseAgency.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChooseAgency
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TouchAppOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/TouchAppOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/reactDevBits/Globe/SpinningGlobe.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/system/esm/colorManipulator/colorManipulator.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
function ChooseAgency(param) {
    let { onSelect, onPreSelect, buttonOnly = false, buttonLabel = 'Sign Up', paddingTop = 60, paddingBottom = 28 } = param;
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const [hoverTick, setHoverTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [spinTick, setSpinTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [overlayVisible, setOverlayVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shiftTick, setShiftTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const holderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const baseSize = 250;
    const scale = 6;
    const scaledSize = baseSize * scale;
    const [globeFits, setGlobeFits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChooseAgency.useEffect": ()=>{
            const checkFit = {
                "ChooseAgency.useEffect.checkFit": ()=>{
                    if (!holderRef.current) return;
                    const containerWidth = holderRef.current.offsetWidth;
                    setGlobeFits(scaledSize <= containerWidth);
                }
            }["ChooseAgency.useEffect.checkFit"];
            checkFit();
            const resizeObserver = new ResizeObserver(checkFit);
            if (holderRef.current) resizeObserver.observe(holderRef.current);
            return ({
                "ChooseAgency.useEffect": ()=>resizeObserver.disconnect()
            })["ChooseAgency.useEffect"];
        }
    }["ChooseAgency.useEffect"], [
        scaledSize
    ]);
    const handleHoverStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChooseAgency.useCallback[handleHoverStart]": ()=>{
            setHoverTick({
                "ChooseAgency.useCallback[handleHoverStart]": (t)=>t + 1
            }["ChooseAgency.useCallback[handleHoverStart]"]);
        }
    }["ChooseAgency.useCallback[handleHoverStart]"], []);
    if (buttonOnly) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            sx: {
                position: 'relative',
                pt: typeof paddingTop === 'number' ? "".concat(paddingTop, "px") : paddingTop,
                pb: typeof paddingBottom === 'number' ? "".concat(paddingBottom, "px") : paddingBottom,
                textAlign: 'center',
                overflow: 'hidden'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    sx: {
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            landColor: '#003FC7',
                            waterColor: '#6FA8FF',
                            autoRotate: true,
                            autoRotateSpeed: 0.15,
                            scale: 1.5,
                            spinTrigger: spinTick || undefined,
                            textureUrl: "earth-blue.png",
                            style: {
                                userSelect: 'none',
                                overflow: 'hidden',
                                isolation: 'isolate'
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/chooseAgency.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                position: 'absolute',
                                inset: 0,
                                pointerEvents: 'none',
                                opacity: overlayVisible ? 1 : 0,
                                transition: 'opacity 700ms ease-in-out'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                landColor: '#d50000ff',
                                waterColor: '#fd5252',
                                autoRotate: true,
                                autoRotateSpeed: 0.5,
                                scale: 1.5,
                                textureUrl: "earth-red.png",
                                spinTrigger: spinTick || undefined,
                                style: {
                                    userSelect: 'none',
                                    overflow: 'hidden',
                                    isolation: 'isolate'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/chooseAgency.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/chooseAgency.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/register/chooseAgency.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    color: "secondary",
                    label: buttonLabel,
                    onClick: ()=>{
                        try {
                            onPreSelect === null || onPreSelect === void 0 ? void 0 : onPreSelect();
                        } catch (e) {}
                        try {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        } catch (e) {}
                        setOverlayVisible(true);
                        setShiftTick((t)=>t + 1);
                        setSpinTick((t)=>t + 1);
                        // Wait for spin burst, then trigger parent switch
                        setTimeout(()=>{
                            onSelect();
                        }, 900);
                    },
                    type: "button",
                    fullWidth: false,
                    sx: {
                        width: 240,
                        mx: 'auto',
                        backgroundColor: theme.palette.common.white,
                        color: theme.palette.primary.main,
                        boxShadow: "0 3px 0 ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.primary.main, 0.35)),
                        '&:hover': {
                            backgroundColor: theme.palette.grey[100]
                        },
                        fontSize: {
                            xs: '14px',
                            lg: '16px'
                        },
                        position: 'relative',
                        zIndex: 1
                    },
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TouchAppOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            color: theme.palette.primary.main
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/chooseAgency.tsx",
                        lineNumber: 144,
                        columnNumber: 17
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/components/register/chooseAgency.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/register/chooseAgency.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            color: '#fff',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            p: 4,
            width: '100%'
        },
        onMouseEnter: handleHoverStart,
        ref: holderRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    position: 'absolute',
                    top: '50%',
                    transform: globeFits ? 'translate(-50%, -50%)' : 'translateY(-50%)',
                    left: globeFits ? '50%' : 'auto',
                    right: globeFits ? 'auto' : 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    width: "".concat(scaledSize, "px"),
                    height: "".concat(scaledSize, "px")
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    landColor: "#003FC7",
                    waterColor: "#6FA8FF",
                    autoRotate: true,
                    autoRotateSpeed: 0.15,
                    scale: scale,
                    spinTrigger: hoverTick > 0 ? hoverTick : undefined,
                    textureUrl: "earth-blue.png",
                    style: {
                        userSelect: 'none',
                        overflow: 'hidden',
                        isolation: 'isolate'
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/register/chooseAgency.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/chooseAgency.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    width: '100%',
                    maxWidth: '100%',
                    textAlign: 'center',
                    position: 'relative',
                    top: '25vh',
                    transform: globeFits ? 'translateY(-30%)' : 'translate(-15%, -30%)',
                    zIndex: 2,
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    px: 2
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "h4",
                        sx: {
                            fontWeight: 500,
                            maxWidth: '75%',
                            mb: 2,
                            fontSize: {
                                xs: '14px',
                                lg: '18px'
                            }
                        },
                        children: [
                            "Do you have an",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                component: "span",
                                sx: {
                                    display: 'inline',
                                    fontWeight: 700,
                                    maxWidth: '75%',
                                    fontSize: {
                                        xs: '14px',
                                        lg: '18px'
                                    }
                                },
                                children: "Agency"
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/chooseAgency.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            "?"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/chooseAgency.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            mb: 4,
                            opacity: 0.95,
                            fontWeight: 600,
                            maxWidth: '75%',
                            fontSize: {
                                xs: '14px',
                                lg: '16px'
                            }
                        },
                        children: "Use this button to enroll it on the website and start earning more now."
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/chooseAgency.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        color: "secondary",
                        label: "Sign Up",
                        onClick: onSelect,
                        type: "button",
                        fullWidth: false,
                        sx: {
                            width: 240,
                            mx: 'auto',
                            backgroundColor: theme.palette.common.white,
                            color: theme.palette.primary.main,
                            boxShadow: "0 3px 0 ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.primary.main, 0.35)),
                            '&:hover': {
                                backgroundColor: theme.palette.grey[100]
                            },
                            fontSize: {
                                xs: '14px',
                                lg: '16px'
                            }
                        },
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TouchAppOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                color: theme.palette.primary.main
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/chooseAgency.tsx",
                            lineNumber: 276,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/chooseAgency.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            mt: 3,
                            color: '#fff',
                            fontStyle: 'italic',
                            fontWeight: 400,
                            maxWidth: '75%',
                            fontSize: {
                                xs: '14px'
                            }
                        },
                        children: [
                            "Already have an Agency account?",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                style: {
                                    fontWeight: 700,
                                    fontStyle: 'normal',
                                    color: 'inherit',
                                    textDecoration: 'none'
                                },
                                children: "Log in"
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/chooseAgency.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/chooseAgency.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/chooseAgency.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                component: "img",
                src: "/ChooseAgency.svg",
                alt: "",
                "aria-hidden": true,
                sx: {
                    position: 'absolute',
                    top: 'auto',
                    bottom: 0,
                    transform: globeFits ? {
                        md: 'translateX(-50%)',
                        lg: 'translateX(-50%)'
                    } : {},
                    left: globeFits ? '50%' : 'auto',
                    right: globeFits ? 'auto' : '-3%',
                    zIndex: 1,
                    width: globeFits ? '1500px' : '60vw',
                    maxWidth: '1500px',
                    height: 'auto',
                    maxHeight: '50%',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    display: 'block'
                }
            }, void 0, false, {
                fileName: "[project]/app/components/register/chooseAgency.tsx",
                lineNumber: 307,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/register/chooseAgency.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_s(ChooseAgency, "bWQSf9UpUWx2nhMZEIy7VfQy8QE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = ChooseAgency;
var _c;
__turbopack_context__.k.register(_c, "ChooseAgency");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/register/chooseInvestor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChooseInvestor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TouchAppOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/TouchAppOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/reactDevBits/Globe/SpinningGlobe.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/system/esm/colorManipulator/colorManipulator.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
function ChooseInvestor(param) {
    let { onSelect, onPreSelect, buttonOnly = false, buttonLabel = 'Sign Up', paddingTop = 60, paddingBottom = 28 } = param;
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const [hoverTick, setHoverTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [spinTick, setSpinTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [overlayVisible, setOverlayVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shiftTick, setShiftTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const holderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleHoverStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChooseInvestor.useCallback[handleHoverStart]": ()=>{
            // Increment to trigger a one-shot spin
            setHoverTick({
                "ChooseInvestor.useCallback[handleHoverStart]": (t)=>t + 1
            }["ChooseInvestor.useCallback[handleHoverStart]"]);
        }
    }["ChooseInvestor.useCallback[handleHoverStart]"], []);
    const baseSize = 250;
    const scale = 6;
    const scaledSize = baseSize * scale;
    const [globeFits, setGlobeFits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChooseInvestor.useEffect": ()=>{
            const checkFit = {
                "ChooseInvestor.useEffect.checkFit": ()=>{
                    if (!holderRef.current) return;
                    const containerWidth = holderRef.current.offsetWidth;
                    setGlobeFits(scaledSize <= containerWidth);
                }
            }["ChooseInvestor.useEffect.checkFit"];
            checkFit();
            const resizeObserver = new ResizeObserver(checkFit);
            if (holderRef.current) resizeObserver.observe(holderRef.current);
            return ({
                "ChooseInvestor.useEffect": ()=>resizeObserver.disconnect()
            })["ChooseInvestor.useEffect"];
        }
    }["ChooseInvestor.useEffect"], [
        scaledSize
    ]);
    if (buttonOnly) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            sx: {
                position: 'relative',
                pt: typeof paddingTop === 'number' ? "".concat(paddingTop, "px") : paddingTop,
                pb: typeof paddingBottom === 'number' ? "".concat(paddingBottom, "px") : paddingBottom,
                textAlign: 'center',
                overflow: 'hidden'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    sx: {
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            landColor: '#d50000ff',
                            waterColor: '#fd5252',
                            autoRotate: true,
                            autoRotateSpeed: 0.15,
                            scale: 1.5,
                            textureUrl: "earth-red.png",
                            spinTrigger: spinTick || undefined,
                            style: {
                                userSelect: 'none',
                                overflow: 'hidden',
                                isolation: 'isolate'
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/chooseInvestor.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                position: 'absolute',
                                inset: 0,
                                pointerEvents: 'none',
                                opacity: overlayVisible ? 1 : 0,
                                transition: 'opacity 700ms ease-in-out'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                landColor: '#003FC7',
                                waterColor: '#6FA8FF',
                                autoRotate: true,
                                autoRotateSpeed: 0.5,
                                scale: 1.5,
                                textureUrl: "earth-blue.png",
                                spinTrigger: spinTick || undefined,
                                style: {
                                    userSelect: 'none',
                                    overflow: 'hidden',
                                    isolation: 'isolate'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/chooseInvestor.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/chooseInvestor.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/register/chooseInvestor.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    color: "secondary",
                    label: buttonLabel,
                    onClick: ()=>{
                        try {
                            onPreSelect === null || onPreSelect === void 0 ? void 0 : onPreSelect();
                        } catch (e) {}
                        try {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        } catch (e) {}
                        setOverlayVisible(true);
                        setShiftTick((t)=>t + 1);
                        setSpinTick((t)=>t + 1);
                        setTimeout(()=>{
                            onSelect();
                        }, 900);
                    },
                    type: "button",
                    fullWidth: false,
                    sx: {
                        width: 240,
                        mx: 'auto',
                        backgroundColor: theme.palette.common.white,
                        color: theme.palette.secondary.main,
                        boxShadow: "0 3px 0 ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.secondary.main, 0.35)),
                        '&:hover': {
                            backgroundColor: theme.palette.grey[100]
                        },
                        fontSize: {
                            xs: '14px',
                            lg: '16px'
                        },
                        position: 'relative',
                        zIndex: 1
                    },
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TouchAppOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            color: theme.palette.secondary.main
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/chooseInvestor.tsx",
                        lineNumber: 144,
                        columnNumber: 17
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/components/register/chooseInvestor.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/register/chooseInvestor.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            color: '#fff',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            p: 4
        },
        onMouseEnter: handleHoverStart,
        ref: holderRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    position: 'absolute',
                    top: '50%',
                    transform: globeFits ? 'translate(-50%, -50%)' : 'translateY(-50%)',
                    left: globeFits ? '50%' : '0',
                    right: globeFits ? 'auto' : 'auto',
                    zIndex: 1,
                    pointerEvents: 'none',
                    width: "".concat(scaledSize, "px"),
                    height: "".concat(scaledSize, "px")
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Globe$2f$SpinningGlobe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    landColor: "#d50000ff",
                    waterColor: "#fd5252",
                    autoRotate: true,
                    autoRotateSpeed: 0.15,
                    scale: scale,
                    spinTrigger: hoverTick > 0 ? hoverTick : undefined,
                    textureUrl: "earth-red.png",
                    style: {
                        userSelect: 'none',
                        overflow: 'hidden',
                        isolation: 'isolate'
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/register/chooseInvestor.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/chooseInvestor.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                component: "img",
                src: "/ChooseInvestor.svg",
                alt: "",
                "aria-hidden": true,
                sx: {
                    position: 'absolute',
                    top: 'auto',
                    bottom: 0,
                    transform: globeFits ? {
                        md: 'translateX(-50%)',
                        lg: 'translateX(-50%)'
                    } : {},
                    left: globeFits ? '50%' : 0,
                    zIndex: 1,
                    width: globeFits ? '1500px' : '60vw',
                    maxWidth: '1000px',
                    height: 'auto',
                    maxHeight: '50%',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    display: 'block'
                }
            }, void 0, false, {
                fileName: "[project]/app/components/register/chooseInvestor.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    width: '100%',
                    maxWidth: '100%',
                    textAlign: 'center',
                    position: 'relative',
                    top: '25vh',
                    transform: globeFits ? 'translateY(-30%)' : 'translate(15%, -30%)',
                    zIndex: 2,
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    px: 2
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "h4",
                        sx: {
                            fontWeight: 500,
                            maxWidth: '75%',
                            mb: 2,
                            fontSize: {
                                xs: '16px',
                                lg: '18px'
                            }
                        },
                        children: [
                            "Are you an",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                component: "span",
                                sx: {
                                    display: 'inline',
                                    fontWeight: 700,
                                    maxWidth: '75%',
                                    fontSize: {
                                        xs: '16px',
                                        lg: '18px'
                                    }
                                },
                                children: "Investor"
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/chooseInvestor.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this),
                            "?"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/chooseInvestor.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            mb: 4,
                            opacity: 0.95,
                            fontWeight: 600,
                            maxWidth: '75%',
                            fontSize: {
                                xs: '14px',
                                lg: '16px'
                            }
                        },
                        children: "Use this button to become an investor and start using our tools now."
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/chooseInvestor.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        color: "secondary",
                        label: "Sign Up",
                        onClick: onSelect,
                        type: "button",
                        fullWidth: false,
                        sx: {
                            width: 240,
                            mx: 'auto',
                            backgroundColor: theme.palette.common.white,
                            color: theme.palette.secondary.main,
                            boxShadow: "0 3px 0 ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.secondary.main, 0.35)),
                            '&:hover': {
                                backgroundColor: theme.palette.grey[100]
                            },
                            fontSize: {
                                xs: '14px',
                                lg: '16px'
                            }
                        },
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TouchAppOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                color: theme.palette.secondary.main
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/chooseInvestor.tsx",
                            lineNumber: 298,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/chooseInvestor.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            mt: 3,
                            color: '#fff',
                            fontStyle: 'italic',
                            fontWeight: 400,
                            maxWidth: '75%',
                            fontSize: {
                                xs: '14px'
                            }
                        },
                        children: [
                            "Already have an Investor account?",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                style: {
                                    fontWeight: 700,
                                    fontStyle: 'normal',
                                    color: 'inherit',
                                    textDecoration: 'none'
                                },
                                children: "Log in"
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/chooseInvestor.tsx",
                                lineNumber: 314,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/chooseInvestor.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/chooseInvestor.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/register/chooseInvestor.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_s(ChooseInvestor, "OWUAACTaXJ1kV/KOdIcCw2jfQVo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = ChooseInvestor;
var _c;
__turbopack_context__.k.register(_c, "ChooseInvestor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/utils/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomInput",
    ()=>CustomInput,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Input$2f$Input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Input/Input.js [app-client] (ecmascript) <export default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DoNotDisturbAltOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/DoNotDisturbAltOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/grey.js [app-client] (ecmascript) <export default as grey>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/system/esm/colorManipulator/colorManipulator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const CustomInput = (param)=>{
    let { focusColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700], bgColor, textColor, icon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DoNotDisturbAltOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500]
        }
    }, void 0, false, {
        fileName: "[project]/app/components/utils/input.tsx",
        lineNumber: 11,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)), label = '', value = '', onChange = ()=>{}, onFocus, onBlur, placeholder = '', type = 'text', disabled = false, locked = false, endAdornment, onEndAdornmentClick, invalid = false } = param;
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const isDisabled = disabled || locked;
    const resolvedBg = isDisabled ? theme.palette.grey[200] : invalid ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.error.main, 0.08) : bgColor !== null && bgColor !== void 0 ? bgColor : theme.palette.background.default;
    const resolvedText = textColor !== null && textColor !== void 0 ? textColor : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: {
                xs: '32px',
                lg: '40px'
            },
            bgcolor: resolvedBg,
            mx: 0,
            borderRadius: {
                xs: '12px',
                lg: '16px'
            },
            color: resolvedText,
            boxShadow: "0 3px 0 ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][300]),
            px: {
                xs: 1,
                lg: 2
            },
            py: {
                xs: 1,
                lg: 2
            },
            ...isDisabled ? {} : {
                '&:focus-within': {
                    boxShadow: "0 3px 0 ".concat(focusColor)
                }
            },
            cursor: isDisabled ? 'not-allowed' : 'text',
            opacity: isDisabled ? 0.95 : 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    display: 'flex',
                    alignItems: 'center',
                    color: isDisabled ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500] : focusColor
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/components/utils/input.tsx",
                lineNumber: 74,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Input$2f$Input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                disableUnderline: true,
                value: value,
                onChange: onChange,
                onFocus: onFocus,
                onBlur: onBlur,
                placeholder: placeholder,
                type: type,
                "aria-label": label,
                disabled: isDisabled,
                sx: {
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: {
                        xs: '14px',
                        lg: '16px'
                    },
                    paddingLeft: 2,
                    flex: 1,
                    color: isDisabled ? 'text.disabled' : resolvedText
                }
            }, void 0, false, {
                fileName: "[project]/app/components/utils/input.tsx",
                lineNumber: 78,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            endAdornment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                onClick: (e)=>onEndAdornmentClick === null || onEndAdornmentClick === void 0 ? void 0 : onEndAdornmentClick(e),
                sx: {
                    ml: 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: isDisabled ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500] : focusColor,
                    cursor: onEndAdornmentClick ? 'pointer' : 'default'
                },
                children: endAdornment
            }, void 0, false, {
                fileName: "[project]/app/components/utils/input.tsx",
                lineNumber: 97,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/utils/input.tsx",
        lineNumber: 51,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CustomInput, "VrMvFCCB9Haniz3VCRPNUiCauHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = CustomInput;
const __TURBOPACK__default__export__ = CustomInput;
var _c;
__turbopack_context__.k.register(_c, "CustomInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/utils/autocomplete.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomAutocomplete",
    ()=>CustomAutocomplete,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Autocomplete$2f$Autocomplete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Autocomplete/Autocomplete.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/TextField/TextField.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/grey.js [app-client] (ecmascript) <export default as grey>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PersonOutlineOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const CustomAutocomplete = (param)=>{
    let { focusColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700], bgColor, textColor, icon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/components/utils/autocomplete.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)), label = '', value = '', onChange = ()=>{}, placeholder = '', options = [], disabled = false, locked = false, selectedColor } = param;
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const isDisabled = disabled || locked;
    const resolvedBg = isDisabled ? theme.palette.grey[200] : bgColor !== null && bgColor !== void 0 ? bgColor : theme.palette.background.default;
    const resolvedText = textColor !== null && textColor !== void 0 ? textColor : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700]; // already grey[700], keep comment for clarity
    var _options_find;
    const selectedOption = (_options_find = options.find((o)=>o.value === value)) !== null && _options_find !== void 0 ? _options_find : null;
    const paperSx = {
        bgcolor: 'background.default',
        '& .MuiAutocomplete-option': {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700]
        },
        ...selectedColor ? {
            // Ensure selected uses provided brand color instead of theme default
            '& .MuiAutocomplete-option.Mui-selected, & .MuiAutocomplete-option[aria-selected="true"]': {
                backgroundColor: "".concat(selectedColor, " !important"),
                color: '#fff'
            },
            '& .MuiAutocomplete-option.Mui-focused': {
                backgroundColor: "".concat(selectedColor, "22")
            }
        } : {}
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: {
                xs: '32px',
                lg: '40px'
            },
            bgcolor: resolvedBg,
            mx: 0,
            borderRadius: {
                xs: '12px',
                lg: '16px'
            },
            color: resolvedText,
            boxShadow: "0 3px 0 ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][300]),
            px: {
                xs: 1,
                lg: 2
            },
            py: {
                xs: 1,
                lg: 2
            },
            ...isDisabled ? {} : {
                '&:focus-within': {
                    boxShadow: "0 3px 0 ".concat(focusColor)
                }
            },
            cursor: isDisabled ? 'not-allowed' : 'text',
            opacity: isDisabled ? 0.95 : 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: isDisabled ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500] : focusColor
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/components/utils/autocomplete.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Autocomplete$2f$Autocomplete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                options: options,
                getOptionLabel: (opt)=>opt.label,
                value: selectedOption,
                onChange: (_, newVal)=>{
                    var _newVal_value;
                    return onChange((_newVal_value = newVal === null || newVal === void 0 ? void 0 : newVal.value) !== null && _newVal_value !== void 0 ? _newVal_value : '');
                },
                disabled: isDisabled,
                isOptionEqualToValue: (opt, val)=>opt.value === val.value,
                slotProps: {
                    paper: {
                        sx: paperSx
                    }
                },
                renderInput: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        ...params,
                        placeholder: placeholder || label,
                        variant: "standard",
                        InputProps: {
                            ...params.InputProps,
                            disableUnderline: true
                        },
                        sx: {
                            width: '100%',
                            '& .MuiInputBase-input': {
                                pl: 0,
                                fontFamily: 'Montserrat, sans-serif',
                                fontSize: {
                                    xs: '14px',
                                    lg: '16px'
                                },
                                color: isDisabled ? 'text.disabled' : resolvedText
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/utils/autocomplete.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, void 0),
                renderOption: (props, option)=>{
                    // Avoid React warning about spreading a key prop by extracting it
                    // See: https://mui.com/material-ui/api/autocomplete/#props-renderoption
                    const { key, ...optionProps } = props;
                    var _option_value;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("li", {
                        ...optionProps,
                        key: "option-".concat(String((_option_value = option.value) !== null && _option_value !== void 0 ? _option_value : key)),
                        __source: {
                            fileName: "[project]/app/components/utils/autocomplete.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }
                    }, option.label);
                },
                freeSolo: false,
                disableClearable: false,
                // keep default popup icon and keyboard interactions like MUI
                sx: {
                    width: '100%'
                }
            }, void 0, false, {
                fileName: "[project]/app/components/utils/autocomplete.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/utils/autocomplete.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CustomAutocomplete, "VrMvFCCB9Haniz3VCRPNUiCauHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = CustomAutocomplete;
const __TURBOPACK__default__export__ = CustomAutocomplete;
var _c;
__turbopack_context__.k.register(_c, "CustomAutocomplete");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgencyCompanyInfoStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Collapse/Collapse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$BusinessCenterOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/BusinessCenterOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$BadgeOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/BadgeOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CalendarMonthOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/CalendarMonthOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PublicOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LanguageOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/LanguageOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/autocomplete.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
const companyTypeOptions = [
    {
        value: 'brokerage',
        label: 'Brokerage'
    },
    {
        value: 'developer',
        label: 'Developer'
    },
    {
        value: 'property_mgmt',
        label: 'Property Management'
    },
    {
        value: 'investment',
        label: 'Investment Firm'
    },
    {
        value: 'other',
        label: 'Other'
    }
];
function AgencyCompanyInfoStep(param) {
    let { companyName, setCompanyName, licenseNumber, setLicenseNumber, establishedYear, setEstablishedYear, companyType, setCompanyType, companyWebsite, setCompanyWebsite } = param;
    _s();
    const GAP = 2;
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const [nameFocused, setNameFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [yearFocused, setYearFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [siteFocused, setSiteFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const currentYear = new Date().getFullYear();
    const isValidCompanyName = (s)=>/^[A-Za-z\u00C0-\u017F\s.]+$/.test(s);
    const isValidWebsite = (s)=>/^https?:\/\/.+\..+/.test(s);
    const yearNum = parseInt(establishedYear || '0', 10);
    const isYearTooHigh = establishedYear.length === 4 && yearNum > currentYear;
    const isYearInvalid = establishedYear.length > 0 && (isNaN(yearNum) || establishedYear.length !== 4);
    const invalidName = companyName.length > 0 && !isValidCompanyName(companyName) && !nameFocused;
    const invalidYear = (isYearInvalid || isYearTooHigh) && !yearFocused && establishedYear.length > 0;
    const invalidSite = companyWebsite.length > 0 && !isValidWebsite(companyWebsite) && !siteFocused;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                sx: {
                    fontWeight: 700,
                    mb: GAP,
                    textAlign: 'left',
                    color: 'grey.500',
                    fontSize: {
                        xs: '1.1rem',
                        md: '1.2rem'
                    }
                },
                children: "Company Information"
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                label: "Company Name",
                value: companyName,
                onChange: (e)=>setCompanyName(e.target.value),
                onFocus: ()=>setNameFocused(true),
                onBlur: ()=>setNameFocused(false),
                placeholder: "Company Name",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$BusinessCenterOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                    lineNumber: 85,
                    columnNumber: 15
                }, void 0),
                focusColor: theme.palette.primary.main,
                invalid: invalidName
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                in: nameFocused && companyName.length > 0 && !isValidCompanyName(companyName),
                timeout: 200,
                unmountOnExit: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                    variant: "caption",
                    sx: {
                        color: 'error.main',
                        pl: 1,
                        mt: 0.5
                    },
                    children: "Company name can contain letters, spaces and dots only."
                }, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    mt: GAP
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    label: "License Number",
                    value: licenseNumber,
                    onChange: (e)=>setLicenseNumber(e.target.value),
                    placeholder: "License Number",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$BadgeOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                        lineNumber: 105,
                        columnNumber: 17
                    }, void 0),
                    focusColor: theme.palette.primary.main
                }, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    display: 'flex',
                    gap: GAP,
                    mt: GAP,
                    flexDirection: {
                        xs: 'column',
                        md: 'row'
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Established Year",
                                value: establishedYear,
                                onChange: (e)=>setEstablishedYear(e.target.value.replace(/[^0-9]/g, '').slice(0, 4)),
                                onFocus: ()=>setYearFocused(true),
                                onBlur: ()=>setYearFocused(false),
                                placeholder: "Year Of Establishment",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CalendarMonthOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                                    lineNumber: 123,
                                    columnNumber: 19
                                }, void 0),
                                focusColor: theme.palette.primary.main,
                                invalid: invalidYear
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                in: yearFocused && isYearInvalid,
                                timeout: 200,
                                unmountOnExit: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "caption",
                                    sx: {
                                        color: 'error.main',
                                        pl: 1,
                                        mt: 0.5
                                    },
                                    children: "Enter a 4-digit year."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                in: yearFocused && !isYearInvalid && isYearTooHigh,
                                timeout: 200,
                                unmountOnExit: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "caption",
                                    sx: {
                                        color: 'error.main',
                                        pl: 1,
                                        mt: 0.5
                                    },
                                    children: "Year cannot be in the future."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            flex: 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            options: companyTypeOptions,
                            value: companyType,
                            onChange: (v)=>setCompanyType(v),
                            label: "Company Type",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                                lineNumber: 144,
                                columnNumber: 19
                            }, void 0),
                            focusColor: theme.palette.primary.main
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    mt: GAP
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Company Website",
                        value: companyWebsite,
                        onChange: (e)=>setCompanyWebsite(e.target.value),
                        onFocus: ()=>setSiteFocused(true),
                        onBlur: ()=>setSiteFocused(false),
                        placeholder: "Official Website (https://example.com)",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LanguageOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                            lineNumber: 158,
                            columnNumber: 17
                        }, void 0),
                        focusColor: theme.palette.primary.main,
                        invalid: invalidSite
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        in: siteFocused && companyWebsite.length > 0 && !isValidWebsite(companyWebsite),
                        timeout: 200,
                        unmountOnExit: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "caption",
                            sx: {
                                color: 'error.main',
                                pl: 1,
                                mt: 0.5
                            },
                            children: "Must start with http:// or https:// and contain a dot."
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(AgencyCompanyInfoStep, "fjMP6dL3XKa3hiTw/eNFk9f8+48=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = AgencyCompanyInfoStep;
var _c;
__turbopack_context__.k.register(_c, "AgencyCompanyInfoStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/utils/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomTextArea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/TextField/TextField.js [app-client] (ecmascript) <export default as TextField>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DoNotDisturbAltOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/DoNotDisturbAltOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/grey.js [app-client] (ecmascript) <export default as grey>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function CustomTextArea(param) {
    let { focusColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700], icon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DoNotDisturbAltOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500]
        }
    }, void 0, false, {
        fileName: "[project]/app/components/utils/textarea.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this), label = '', value = '', onChange = ()=>{}, placeholder = '', disabled = false, locked = false, minRows = 3, maxRows = 6, bgColor, textColor } = param;
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const isDisabled = disabled || locked;
    const resolvedBg = isDisabled ? theme.palette.grey[200] : bgColor !== null && bgColor !== void 0 ? bgColor : theme.palette.background.default;
    const resolvedText = textColor !== null && textColor !== void 0 ? textColor : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: {
                xs: 72,
                lg: 96
            },
            bgcolor: resolvedBg,
            mx: 0,
            borderRadius: {
                xs: '12px',
                lg: '16px'
            },
            color: resolvedText,
            boxShadow: "0 3px 0 ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][300]),
            px: {
                xs: 1,
                lg: 2
            },
            py: {
                xs: 1.5,
                lg: 2
            },
            ...isDisabled ? {} : {
                '&:focus-within': {
                    boxShadow: "0 3px 0 ".concat(focusColor)
                }
            },
            cursor: isDisabled ? 'not-allowed' : 'text',
            opacity: isDisabled ? 0.95 : 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    color: isDisabled ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500] : focusColor,
                    pt: 0.5
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/components/utils/textarea.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                variant: "standard",
                multiline: true,
                minRows: minRows,
                maxRows: maxRows,
                value: value,
                onChange: onChange,
                placeholder: placeholder || label,
                InputProps: {
                    disableUnderline: true
                },
                "aria-label": label,
                disabled: isDisabled,
                sx: {
                    width: '100%',
                    ml: 2,
                    '& .MuiInputBase-input': {
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: {
                            xs: '14px',
                            lg: '16px'
                        },
                        color: isDisabled ? 'text.disabled' : resolvedText
                    }
                }
            }, void 0, false, {
                fileName: "[project]/app/components/utils/textarea.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/utils/textarea.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(CustomTextArea, "VrMvFCCB9Haniz3VCRPNUiCauHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = CustomTextArea;
var _c;
__turbopack_context__.k.register(_c, "CustomTextArea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/utils/checkboxGroup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CheckboxGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Checkbox$2f$Checkbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Checkbox$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Checkbox/Checkbox.js [app-client] (ecmascript) <export default as Checkbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControlLabel$2f$FormControlLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControlLabel$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/FormControlLabel/FormControlLabel.js [app-client] (ecmascript) <export default as FormControlLabel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormGroup$2f$FormGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormGroup$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/FormGroup/FormGroup.js [app-client] (ecmascript) <export default as FormGroup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/grey.js [app-client] (ecmascript) <export default as grey>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CheckBoxOutlineBlankRounded$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/CheckBoxOutlineBlankRounded.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CheckBoxRounded$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/CheckBoxRounded.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function CheckboxGroup(param) {
    let { label, options, values, onChange, focusColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700] } = param;
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const activeColor = focusColor !== null && focusColor !== void 0 ? focusColor : theme.palette.primary.main;
    const toggle = (val)=>{
        const next = values.includes(val) ? values.filter((v)=>v !== val) : [
            ...values,
            val
        ];
        onChange(next);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                sx: {
                    fontWeight: 700,
                    mt: 1,
                    mb: 1,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500],
                    fontSize: {
                        xs: '16px',
                        lg: '18px'
                    }
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/app/components/utils/checkboxGroup.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    bgcolor: theme.palette.common.white,
                    borderRadius: {
                        xs: '12px',
                        lg: '16px'
                    },
                    boxShadow: "0 3px 0 ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][300]),
                    px: {
                        xs: 2,
                        lg: 3
                    },
                    py: {
                        xs: 1.5,
                        lg: 2
                    },
                    '&:focus-within': {
                        boxShadow: "0 3px 0 ".concat(activeColor)
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormGroup$2f$FormGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormGroup$3e$__["FormGroup"], {
                    sx: {
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '1fr 1fr'
                        },
                        gap: 1
                    },
                    children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControlLabel$2f$FormControlLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControlLabel$3e$__["FormControlLabel"], {
                            label: o.label,
                            sx: {
                                '& .MuiFormControlLabel-label': {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700],
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontSize: {
                                        xs: '14px',
                                        lg: '16px'
                                    }
                                }
                            },
                            control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Checkbox$2f$Checkbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Checkbox$3e$__["Checkbox"], {
                                checked: values.includes(o.value),
                                onChange: ()=>toggle(o.value),
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CheckBoxOutlineBlankRounded$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        scale: 1.2
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/utils/checkboxGroup.tsx",
                                    lineNumber: 69,
                                    columnNumber: 25
                                }, void 0),
                                checkedIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CheckBoxRounded$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        scale: 1.2
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/utils/checkboxGroup.tsx",
                                    lineNumber: 70,
                                    columnNumber: 32
                                }, void 0),
                                sx: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500],
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 16
                                    },
                                    '&.Mui-checked': {
                                        color: 'secondary.main'
                                    }
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/utils/checkboxGroup.tsx",
                                lineNumber: 66,
                                columnNumber: 17
                            }, void 0)
                        }, o.value, false, {
                            fileName: "[project]/app/components/utils/checkboxGroup.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/components/utils/checkboxGroup.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/utils/checkboxGroup.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/utils/checkboxGroup.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(CheckboxGroup, "VrMvFCCB9Haniz3VCRPNUiCauHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = CheckboxGroup;
var _c;
__turbopack_context__.k.register(_c, "CheckboxGroup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgencyBusinessProfileStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Menu/Menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/MenuItem/MenuItem.js [app-client] (ecmascript) <export default as MenuItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/system/esm/colorManipulator/colorManipulator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/grey.js [app-client] (ecmascript) <export default as grey>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$checkboxGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/checkboxGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EuroOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/EuroOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TrendingUpOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/TrendingUpOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$WorkOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/WorkOutlineOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EmojiEventsOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/EmojiEventsOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AttachMoneyOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/AttachMoneyOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyPoundOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/CurrencyPoundOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyYenOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/CurrencyYenOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyFrancOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/CurrencyFrancOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ArrowDropDown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/ArrowDropDown.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$MonetizationOnOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/MonetizationOnOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const marketOptions = [
    {
        value: 'residential',
        label: 'Residential'
    },
    {
        value: 'commercial',
        label: 'Commercial'
    },
    {
        value: 'luxury',
        label: 'Luxury'
    },
    {
        value: 'land',
        label: 'Land Development'
    }
];
function AgencyBusinessProfileStep(param) {
    let { primaryMarkets, setPrimaryMarkets, yearlyTransactions, setYearlyTransactions, averagePropertyValue, setAveragePropertyValue, experienceExpertise, setExperienceExpertise, notableProjects, setNotableProjects, currency, setCurrency } = param;
    _s();
    const GAP = 2;
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const [anchorEl, setAnchorEl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const open = Boolean(anchorEl);
    const currencyIcon = (code)=>{
        switch(code){
            case 'USD':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AttachMoneyOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                    lineNumber: 64,
                    columnNumber: 16
                }, this);
            case 'GBP':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyPoundOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                    lineNumber: 66,
                    columnNumber: 16
                }, this);
            case 'JPY':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyYenOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                    lineNumber: 68,
                    columnNumber: 16
                }, this);
            case 'CHF':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyFrancOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                    lineNumber: 70,
                    columnNumber: 16
                }, this);
            case 'EUR':
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EuroOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                    lineNumber: 73,
                    columnNumber: 16
                }, this);
        }
    };
    const handleCurrencyClick = (e)=>setAnchorEl((e === null || e === void 0 ? void 0 : e.currentTarget) || null);
    const handleCurrencySelect = (code)=>{
        setCurrency(code);
        setAnchorEl(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                sx: {
                    fontWeight: 700,
                    mb: GAP,
                    textAlign: 'left',
                    color: 'grey.500',
                    fontSize: {
                        xs: '1.1rem',
                        md: '1.2rem'
                    }
                },
                children: "Business Profile"
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                sx: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 700,
                    mt: 1,
                    mb: 1,
                    textAlign: 'left',
                    color: 'grey.500',
                    fontSize: {
                        xs: '16px',
                        md: '18px',
                        lg: '20px'
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$MonetizationOnOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            color: theme.palette.primary.main
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    " Primary Markets"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$checkboxGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                options: marketOptions,
                values: primaryMarkets,
                onChange: setPrimaryMarkets,
                focusColor: theme.palette.primary.main
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: GAP,
                    mt: GAP
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            flex: 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Yearly Transactions",
                            value: yearlyTransactions,
                            onChange: (e)=>setYearlyTransactions(e.target.value.replace(/[^0-9]/g, '')),
                            placeholder: "Yearly Transactions",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TrendingUpOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                                lineNumber: 126,
                                columnNumber: 19
                            }, void 0),
                            focusColor: theme.palette.primary.main
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Average Property Value",
                                value: averagePropertyValue,
                                onChange: (e)=>setAveragePropertyValue(e.target.value.replace(/[^0-9.,]/g, '')),
                                placeholder: "Average Property Value",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TrendingUpOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                                    lineNumber: 138,
                                    columnNumber: 19
                                }, void 0),
                                endAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    sx: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: theme.palette.primary.main
                                    },
                                    children: [
                                        currencyIcon(currency),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ArrowDropDown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, void 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                                    lineNumber: 140,
                                    columnNumber: 15
                                }, void 0),
                                onEndAdornmentClick: handleCurrencyClick,
                                focusColor: theme.palette.primary.main
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                anchorEl: anchorEl,
                                open: open,
                                onClose: ()=>setAnchorEl(null),
                                PaperProps: {
                                    sx: {
                                        bgcolor: theme.palette.common.white,
                                        borderRadius: 2,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                    }
                                },
                                MenuListProps: {
                                    sx: {
                                        p: 0,
                                        bgcolor: theme.palette.common.white
                                    }
                                },
                                children: [
                                    {
                                        code: 'EUR',
                                        label: 'EUR',
                                        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EuroOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                    },
                                    {
                                        code: 'USD',
                                        label: 'USD',
                                        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AttachMoneyOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                    },
                                    {
                                        code: 'GBP',
                                        label: 'GBP',
                                        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyPoundOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                    },
                                    {
                                        code: 'JPY',
                                        label: 'JPY',
                                        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyYenOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                    },
                                    {
                                        code: 'CHF',
                                        label: 'CHF',
                                        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CurrencyFrancOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                    }
                                ].map((param)=>{
                                    let { code, label, Icon } = param;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                        onClick: ()=>handleCurrencySelect(code),
                                        selected: currency === code,
                                        sx: {
                                            bgcolor: theme.palette.background.default,
                                            '&.Mui-selected': {
                                                bgcolor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.primary.main, 0.1)
                                            },
                                            '&.Mui-selected:hover': {
                                                bgcolor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.primary.main, 0.16)
                                            },
                                            '&:hover': {
                                                bgcolor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.background.default, 0.9)
                                            }
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                sx: {
                                                    mr: 1,
                                                    color: currency === code ? theme.palette.primary.main : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500]
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                                                lineNumber: 194,
                                                columnNumber: 17
                                            }, this),
                                            label
                                        ]
                                    }, code, true, {
                                        fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    mt: GAP
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    label: "Company Experience & Expertise",
                    value: experienceExpertise,
                    onChange: (e)=>setExperienceExpertise(e.target.value),
                    placeholder: "Briefly describe your experience and areas of expertise",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$WorkOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            color: theme.palette.primary.main
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                        lineNumber: 210,
                        columnNumber: 17
                    }, void 0),
                    focusColor: theme.palette.primary.main
                }, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    mt: GAP
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    label: "Notable Projects",
                    value: notableProjects,
                    onChange: (e)=>setNotableProjects(e.target.value),
                    placeholder: "Share a few standout projects",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EmojiEventsOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            color: theme.palette.primary.main
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                        lineNumber: 221,
                        columnNumber: 17
                    }, void 0),
                    focusColor: theme.palette.primary.main
                }, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_s(AgencyBusinessProfileStep, "m5CU/5Elm19ORII+to6gwaUEdLs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = AgencyBusinessProfileStep;
var _c;
__turbopack_context__.k.register(_c, "AgencyBusinessProfileStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/utils/chipSelect.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChipSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Chip/Chip.js [app-client] (ecmascript) <export default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/grey.js [app-client] (ecmascript) <export default as grey>");
;
;
;
function ChipSelect(param) {
    let { label, options, values, onChange, focusColor = '#e93b20' } = param;
    const toggle = (val)=>{
        const next = values.includes(val) ? values.filter((v)=>v !== val) : [
            ...values,
            val
        ];
        onChange(next);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                sx: {
                    fontWeight: 700,
                    mb: 1,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500]
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/app/components/utils/chipSelect.tsx",
                lineNumber: 28,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    bgcolor: '#fff',
                    borderRadius: {
                        xs: '12px',
                        lg: '16px'
                    },
                    boxShadow: "0 6px 0 ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][300]),
                    px: {
                        xs: 2,
                        lg: 3
                    },
                    py: {
                        xs: 1.5,
                        lg: 2
                    },
                    '&:focus-within': {
                        boxShadow: "0 6px 0 ".concat(focusColor)
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap'
                    },
                    children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                            label: o.label,
                            onClick: ()=>toggle(o.value),
                            color: values.includes(o.value) ? 'primary' : 'default',
                            sx: {
                                borderRadius: 2,
                                bgcolor: values.includes(o.value) ? focusColor : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][100],
                                color: values.includes(o.value) ? '#fff' : 'text.primary'
                            }
                        }, o.value, false, {
                            fileName: "[project]/app/components/utils/chipSelect.tsx",
                            lineNumber: 41,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/components/utils/chipSelect.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/utils/chipSelect.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/utils/chipSelect.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = ChipSelect;
var _c;
__turbopack_context__.k.register(_c, "ChipSelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgencyPartnershipGoalsStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$HandshakeOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/HandshakeOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$chipSelect$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/chipSelect.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$checkboxGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/checkboxGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const regionOptions = [
    {
        value: 'local',
        label: 'Local'
    },
    {
        value: 'regional',
        label: 'Regional'
    },
    {
        value: 'national',
        label: 'National'
    },
    {
        value: 'international',
        label: 'International'
    }
];
const targetOptions = [
    {
        value: 'buyers',
        label: 'Buyers'
    },
    {
        value: 'sellers',
        label: 'Sellers'
    },
    {
        value: 'investors',
        label: 'Investors'
    },
    {
        value: 'renters',
        label: 'Renters'
    },
    {
        value: 'developers',
        label: 'Developers'
    }
];
const servicesOptions = [
    {
        value: 'valuation',
        label: 'Property Valuation'
    },
    {
        value: 'legal',
        label: 'Legal Assistance'
    },
    {
        value: 'management',
        label: 'Property Management'
    },
    {
        value: 'market_analysis',
        label: 'Market Analysis'
    },
    {
        value: 'mortgage',
        label: 'Mortgage Assistance'
    },
    {
        value: 'renovation',
        label: 'Renovation Experts'
    },
    {
        value: 'staging',
        label: 'Home Staging'
    },
    {
        value: 'exclusive',
        label: 'Exclusive Property Deals'
    }
];
const additionalOptions = [
    {
        value: 'networking',
        label: 'Networking/Promotional Support'
    },
    {
        value: 'exclusive_deals',
        label: 'Exclusive Property Deals'
    }
];
function AgencyPartnershipGoalsStep(param) {
    let { partnershipReason, setPartnershipReason, regionPreferences, setRegionPreferences, targetClients, setTargetClients, servicesProvided, setServicesProvided, additionalInterests, setAdditionalInterests } = param;
    _s();
    const GAP = 1; // compact spacing to fit 100vh
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            display: 'flex',
            flexDirection: 'column'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                sx: {
                    fontWeight: 700,
                    mb: GAP,
                    textAlign: 'left',
                    color: 'grey.500',
                    fontSize: {
                        xs: '1.05rem',
                        md: '1.15rem'
                    }
                },
                children: "Partnership Goals"
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                label: "Why do you want to partner with Nomad Estate?",
                value: partnershipReason,
                onChange: (e)=>setPartnershipReason(e.target.value),
                placeholder: "Tell us about your goals and what you want to achieve",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$HandshakeOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    sx: {
                        color: theme.palette.primary.main
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                    lineNumber: 85,
                    columnNumber: 15
                }, void 0),
                focusColor: theme.palette.primary.main,
                minRows: 2,
                maxRows: 4
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr 1fr'
                    },
                    gap: {
                        xs: GAP,
                        md: GAP * 1.5
                    },
                    mt: GAP
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$chipSelect$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Regional Network Listings",
                        options: regionOptions,
                        values: regionPreferences,
                        onChange: setRegionPreferences
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$chipSelect$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Target Client Type",
                        options: targetOptions,
                        values: targetClients,
                        onChange: setTargetClients
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    mt: GAP
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$checkboxGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    label: "Services You Provide",
                    options: servicesOptions,
                    values: servicesProvided,
                    onChange: setServicesProvided,
                    focusColor: theme.palette.primary.main
                }, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    mt: GAP
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$checkboxGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    label: "Additional Partnership Interests",
                    options: additionalOptions,
                    values: additionalInterests,
                    onChange: setAdditionalInterests,
                    focusColor: theme.palette.primary.main
                }, void 0, false, {
                    fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(AgencyPartnershipGoalsStep, "VrMvFCCB9Haniz3VCRPNUiCauHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = AgencyPartnershipGoalsStep;
var _c;
__turbopack_context__.k.register(_c, "AgencyPartnershipGoalsStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/reactDevBits/Glare/Glare.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const Glare = (param)=>{
    let { width = 'auto', height = 'auto', background = 'transparent', borderRadius = '16px', borderColor = 'transparent', children, glareColor = '#ffffff', glareOpacity = 0.5, glareAngle = -45, glareSize = 250, transitionDuration = 650, className = '', style = {}, shouldPlay = false } = param;
    _s();
    const hex = glareColor.replace('#', '');
    let rgba = glareColor;
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        rgba = "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(glareOpacity, ")");
    } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        rgba = "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(glareOpacity, ")");
    }
    const vars = {
        '--gh-width': width,
        '--gh-height': height,
        '--gh-bg': background,
        '--gh-br': borderRadius,
        '--gh-angle': "".concat(glareAngle, "deg"),
        '--gh-duration': "".concat(transitionDuration, "ms"),
        '--gh-size': "".concat(glareSize, "%"),
        '--gh-rgba': rgba,
        '--gh-border': borderColor
    };
    const [run, setRun] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const prev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(shouldPlay);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Glare.useEffect": ()=>{
            if (!prev.current && shouldPlay) {
                // Rising edge: trigger animation
                setRun(true);
                const t = setTimeout({
                    "Glare.useEffect.t": ()=>setRun(false)
                }["Glare.useEffect.t"], transitionDuration + 50);
                prev.current = shouldPlay;
                return ({
                    "Glare.useEffect": ()=>clearTimeout(t)
                })["Glare.useEffect"];
            }
            prev.current = shouldPlay;
        }
    }["Glare.useEffect"], [
        shouldPlay,
        transitionDuration
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glare ".concat(className),
        "data-run": run ? 'true' : 'false',
        style: {
            ...vars,
            display: 'inline-grid',
            ...style
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/reactDevBits/Glare/Glare.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Glare, "hynMmQbtWac7z/huupMGQieHg3I=");
_c = Glare;
const __TURBOPACK__default__export__ = Glare;
var _c;
__turbopack_context__.k.register(_c, "Glare");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/register/signUpAsAgency.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignUpAsAgency
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// API calls are handled in the parent register page after submission
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Collapse/Collapse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EmailOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/EmailOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LockOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/LockOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PersonOutlineOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AddOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/AddOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PhoneIphoneOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PhoneIphoneOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PublicOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/autocomplete.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/VisibilityOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOffOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/VisibilityOffOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ArrowBackIosNew$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/ArrowBackIosNew.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$agencySteps$2f$AgencyCompanyInfoStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/register/agencySteps/AgencyCompanyInfoStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$agencySteps$2f$AgencyBusinessProfileStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/register/agencySteps/AgencyBusinessProfileStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$agencySteps$2f$AgencyPartnershipGoalsStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/register/agencySteps/AgencyPartnershipGoalsStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Glare$2f$Glare$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/reactDevBits/Glare/Glare.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/system/esm/colorManipulator/colorManipulator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function SignUpAsAgency(props) {
    _s();
    const { countries, states, cities, selectedCountryId, selectedStateId, selectedCityId, setSelectedCountryById, setSelectedStateById, setSelectedCityById, email, setEmail, password, setPassword, firstName, setFirstName, lastName, setLastName, phonePrefix, setPhonePrefix, phoneNumber, setPhoneNumber, onSubmit } = props;
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    // simple phone prefix options (can be extended)
    const phonePrefixOptions = [
        '+1',
        '+7',
        '+20',
        '+27',
        '+30',
        '+31',
        '+32',
        '+33',
        '+34',
        '+36',
        '+39',
        '+40',
        '+41',
        '+43',
        '+44',
        '+45',
        '+46',
        '+47',
        '+48',
        '+49',
        '+52',
        '+55',
        '+57',
        '+60',
        '+61',
        '+62',
        '+63',
        '+64',
        '+65',
        '+66',
        '+81',
        '+82',
        '+84',
        '+86',
        '+90',
        '+91',
        '+92',
        '+94',
        '+351',
        '+352',
        '+353',
        '+354',
        '+355',
        '+356',
        '+358',
        '+359',
        '+370',
        '+371',
        '+372',
        '+380',
        '+386',
        '+420',
        '+421'
    ].map((p)=>({
            value: p,
            label: p
        }));
    // phonePrefix is lifted to parent via props
    const [officeStreetAddress, setOfficeStreetAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // New multi-page wizard states
    const [stepIndex, setStepIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // 0: Contact & Location (existing), 1: Company Info, 2: Business Profile, 3: Partnership Goals
    // Company Info
    const [companyName, setCompanyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [licenseNumber, setLicenseNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [establishedYear, setEstablishedYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [companyType, setCompanyType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [companyWebsite, setCompanyWebsite] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Business Profile
    const [primaryMarkets, setPrimaryMarkets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [yearlyTransactions, setYearlyTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [averagePropertyValue, setAveragePropertyValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [avgCurrency, setAvgCurrency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('EUR');
    const [experienceExpertise, setExperienceExpertise] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [notableProjects, setNotableProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Partnership Goals
    const [partnershipReason, setPartnershipReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [regionPreferences, setRegionPreferences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [targetClients, setTargetClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [servicesProvided, setServicesProvided] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [additionalInterests, setAdditionalInterests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const GAP = 2;
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pwFocused, setPwFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showConfirmPw, setShowConfirmPw] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmFocused, setConfirmFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [emailFocused, setEmailFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [firstFocused, setFirstFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastFocused, setLastFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [phoneFocused, setPhoneFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [streetFocused, setStreetFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isLettersOnly = (s)=>/^[A-Za-z\u00C0-\u017F\s'-]+$/.test(s);
    const isEmail = (s)=>/.+@.+\..+/.test(s);
    const isDigits = (s)=>/^\d+$/.test(s);
    const isNineDigits = (s)=>/^\d{9}$/.test(s);
    // Agency has an extra step for Office Street Address (5 steps total)
    // Step completion booleans
    const isStep0Complete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsAgency.useMemo[isStep0Complete]": ()=>{
            const strong = /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8;
            const step1 = email.includes('@') && strong;
            const step2 = firstName.trim().length > 0 && lastName.trim().length > 0;
            const step3 = String(phonePrefix).trim().length > 0 && isNineDigits(phoneNumber.trim());
            // Align with Investor: require Country + City (State may be optional)
            const step4 = selectedCountryId !== '' && selectedCityId !== '';
            const step5 = officeStreetAddress.trim().length > 15;
            const pwMatch = confirmPassword.length > 0 && confirmPassword === password;
            return step1 && step2 && step3 && step4 && step5 && strong && pwMatch;
        }
    }["SignUpAsAgency.useMemo[isStep0Complete]"], [
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phonePrefix,
        phoneNumber,
        selectedCountryId,
        selectedStateId,
        selectedCityId,
        officeStreetAddress
    ]);
    const isUrl = (s)=>/^https?:\/\/.+\..+/.test(s);
    const isStep1Complete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsAgency.useMemo[isStep1Complete]": ()=>companyName.trim().length > 0 && licenseNumber.trim().length > 0 && establishedYear.trim().length === 4 && !!companyType && isUrl(companyWebsite)
    }["SignUpAsAgency.useMemo[isStep1Complete]"], [
        companyName,
        licenseNumber,
        establishedYear,
        companyType,
        companyWebsite
    ]);
    const isStep2Complete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsAgency.useMemo[isStep2Complete]": ()=>primaryMarkets.length > 0 && yearlyTransactions.trim().length > 0 && averagePropertyValue.trim().length > 0 && experienceExpertise.trim().length > 0 && notableProjects.trim().length > 0
    }["SignUpAsAgency.useMemo[isStep2Complete]"], [
        primaryMarkets,
        yearlyTransactions,
        averagePropertyValue,
        experienceExpertise,
        notableProjects
    ]);
    const isStep3Complete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsAgency.useMemo[isStep3Complete]": ()=>partnershipReason.trim().length > 0 && regionPreferences.length > 0 && targetClients.length > 0 && servicesProvided.length > 0 && additionalInterests.length > 0
    }["SignUpAsAgency.useMemo[isStep3Complete]"], [
        partnershipReason,
        regionPreferences,
        targetClients,
        servicesProvided,
        additionalInterests
    ]);
    // Overall form completion (single progress for the entire form)
    const overallCompletion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsAgency.useMemo[overallCompletion]": ()=>{
            // 20 checks (5 per step)
            const checks = [
                // Step 0
                email.includes('@') && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8 && confirmPassword.length > 0 && confirmPassword === password,
                firstName.trim().length > 0 && lastName.trim().length > 0,
                String(phonePrefix).trim().length > 0 && isNineDigits(phoneNumber.trim()),
                // Align with Investor: require Country + City (State may be optional)
                selectedCountryId !== '' && selectedCityId !== '',
                officeStreetAddress.trim().length > 15,
                // Step 1
                companyName.trim().length > 0,
                licenseNumber.trim().length > 0,
                establishedYear.trim().length === 4,
                !!companyType,
                companyWebsite.trim().length > 0,
                // Step 2
                primaryMarkets.length > 0,
                yearlyTransactions.trim().length > 0,
                averagePropertyValue.trim().length > 0,
                experienceExpertise.trim().length > 0,
                notableProjects.trim().length > 0,
                // Step 3
                partnershipReason.trim().length > 0,
                regionPreferences.length > 0,
                targetClients.length > 0,
                servicesProvided.length > 0,
                additionalInterests.length > 0
            ];
            const done = checks.filter(Boolean).length;
            return Math.round(done / checks.length * 100);
        }
    }["SignUpAsAgency.useMemo[overallCompletion]"], [
        email,
        password,
        firstName,
        lastName,
        phonePrefix,
        phoneNumber,
        selectedCountryId,
        selectedStateId,
        selectedCityId,
        officeStreetAddress,
        companyName,
        licenseNumber,
        establishedYear,
        companyType,
        companyWebsite,
        primaryMarkets,
        yearlyTransactions,
        averagePropertyValue,
        experienceExpertise,
        notableProjects,
        partnershipReason,
        regionPreferences,
        targetClients,
        servicesProvided,
        additionalInterests
    ]);
    const isCurrentStepComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsAgency.useMemo[isCurrentStepComplete]": ()=>{
            if (stepIndex === 0) return isStep0Complete;
            if (stepIndex === 1) return isStep1Complete;
            if (stepIndex === 2) return isStep2Complete;
            if (stepIndex === 3) return isStep3Complete;
            return false;
        }
    }["SignUpAsAgency.useMemo[isCurrentStepComplete]"], [
        stepIndex,
        isStep0Complete,
        isStep1Complete,
        isStep2Complete,
        isStep3Complete
    ]);
    const isFormComplete = isStep0Complete && isStep1Complete && isStep2Complete && isStep3Complete;
    const pwRules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsAgency.useMemo[pwRules]": ()=>({
                len: password.length >= 8,
                upper: /[A-Z]/.test(password),
                lower: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[^A-Za-z0-9]/.test(password)
            })
    }["SignUpAsAgency.useMemo[pwRules]"], [
        password
    ]);
    const invalidEmail = !isEmail(email) && !emailFocused && email.length > 0;
    const invalidPassword = !(pwRules.len && pwRules.upper && pwRules.lower && pwRules.number && pwRules.special) && !pwFocused && password.length > 0;
    const invalidFirst = firstName.length > 0 && !isLettersOnly(firstName) && !firstFocused;
    const invalidLast = lastName.length > 0 && !isLettersOnly(lastName) && !lastFocused;
    const invalidPhone = phoneNumber.length > 0 && (!isDigits(phoneNumber) || !isNineDigits(phoneNumber)) && !phoneFocused;
    const invalidConfirm = confirmPassword.length > 0 && confirmPassword !== password && !confirmFocused;
    const invalidStreet = officeStreetAddress.length > 0 && officeStreetAddress.trim().length <= 15 && !streetFocused;
    // Progress bar animation trigger when completion increases
    const [lastCompletion, setLastCompletion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(overallCompletion);
    const [barAnimate, setBarAnimate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignUpAsAgency.useEffect": ()=>{
            if (overallCompletion > lastCompletion) {
                setBarAnimate(true);
                const t = setTimeout({
                    "SignUpAsAgency.useEffect.t": ()=>setBarAnimate(false)
                }["SignUpAsAgency.useEffect.t"], 700);
                setLastCompletion(overallCompletion);
                return ({
                    "SignUpAsAgency.useEffect": ()=>clearTimeout(t)
                })["SignUpAsAgency.useEffect"];
            }
            if (overallCompletion !== lastCompletion) setLastCompletion(overallCompletion);
        }
    }["SignUpAsAgency.useEffect"], [
        overallCompletion,
        lastCompletion
    ]);
    const mapCompanyType = (v)=>{
        const m = {
            brokerage: 'BROKERAGE_FIRM',
            developer: 'PROPERTY_DEVELOPER',
            property_mgmt: 'REAL_ESTATE_CONSULTANT',
            investment: 'INVESTMENT_COMPANY',
            other: 'NONE'
        };
        return typeof v === 'string' ? m[v] || 'NONE' : 'NONE';
    };
    const toInt = function(s) {
        let fallback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        const n = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
        return Number.isFinite(n) ? n : fallback;
    };
    const bucketTransactions = (n)=>n <= 10 ? 0 : n <= 50 ? 1 : n <= 100 ? 2 : 3;
    const bucketAvgValue = (n)=>n < 200_000 ? 0 : n <= 500_000 ? 1 : n <= 1_000_000 ? 2 : n <= 5_000_000 ? 3 : 4;
    const toEur = (amount, currency)=>{
        const rates = {
            EUR: 1,
            USD: 0.94,
            GBP: 1.17,
            JPY: 0.006,
            CHF: 1.03
        };
        var _rates_currency;
        return Math.max(0, Math.round(amount * ((_rates_currency = rates[currency]) !== null && _rates_currency !== void 0 ? _rates_currency : 1)));
    };
    // Map UI values to backend enum strings
    const mapPrimaryMarket = (vals)=>{
        const m = {
            residential: 'RESIDENTIAL',
            commercial: 'COMMERCIAL',
            luxury: 'LUXURY',
            land: 'LAND_DEVELOPMENT'
        };
        return vals.map((v)=>m[v]).filter(Boolean);
    };
    const mapServiceProvided = (vals)=>{
        const m = {
            valuation: 'PROPERTY_VALUATION',
            legal: 'LEGAL_ASSISTANCE',
            management: 'PROPERTY_MANAGEMENT',
            market_analysis: 'INVESTMENT_ANALYSIS',
            mortgage: 'BANKING_CONNECTIONS'
        };
        return vals.map((v)=>m[v]).filter(Boolean);
    };
    const mapAdditionalInterests = (vals)=>{
        const m = {
            networking: 'MARKETING_PROMOTIONAL_SUPPORT',
            exclusive_deals: 'EXCLUSIVE_PROPERTY_DEALS'
        };
        return vals.map((v)=>m[v]).filter(Boolean);
    };
    const handleSubmit = async ()=>{
        if (!isFormComplete) return;
        try {
            const established = toInt(establishedYear, new Date().getFullYear());
            const yearSafe = Math.min(established, new Date().getFullYear());
            const yearlyTxNum = toInt(yearlyTransactions, 0);
            const avgValInput = toInt(averagePropertyValue, 0);
            const avgValEur = toEur(avgValInput, avgCurrency);
            const payload = {
                email,
                password,
                phoneNumber: "".concat(String(phonePrefix), " ").concat(phoneNumber).trim(),
                firstName,
                lastName,
                countryId: Number(selectedCountryId) || 0,
                cityId: Number(selectedCityId) || 0,
                streetAddress: officeStreetAddress,
                stateId: Number(selectedStateId) || 0,
                postalCode: '',
                companyName,
                companyType: mapCompanyType(companyType),
                licenseNumber,
                companyWebsite,
                establishedYear: yearSafe,
                yearlyRange: bucketTransactions(yearlyTxNum),
                avgPropertyValue: bucketAvgValue(avgValEur),
                companyExperience: experienceExpertise,
                notableProjects,
                reasonPartner: partnershipReason,
                expectedMonthlyListings: 0,
                targetClient: 'ALL_TYPES',
                // new related arrays
                primaryMarkets: mapPrimaryMarket(primaryMarkets),
                servicesProvided: mapServiceProvided(servicesProvided),
                additionalPartnershipInterests: mapAdditionalInterests(additionalInterests)
            };
            // Delegate API flow to parent: send core payload + related selections (already mapped to enums)
            if (typeof onSubmit === 'function') {
                onSubmit({
                    payload: payload,
                    related: {
                        primaryMarkets: mapPrimaryMarket(primaryMarkets),
                        servicesProvided: mapServiceProvided(servicesProvided),
                        additionalPartnershipInterests: mapAdditionalInterests(additionalInterests)
                    }
                });
            }
        } catch (e) {
            console.error('Agency register failed', e);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            pt: {
                xs: '24px',
                md: '80px'
            },
            px: {
                xs: 3,
                md: 4
            },
            width: '100%',
            maxWidth: {
                xs: '100%',
                md: '100%'
            },
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: {
                xs: 'auto',
                md: '100vh'
            },
            overflow: {
                xs: 'visible',
                md: 'hidden'
            },
            minHeight: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                variant: "h4",
                sx: {
                    mb: 0,
                    fontWeight: 700,
                    textAlign: 'center',
                    fontSize: {
                        xs: '1.5rem',
                        md: '2rem'
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        component: "span",
                        sx: {
                            color: 'primary.main',
                            fontWeight: 700
                        },
                        children: "Sign up as"
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 528,
                        columnNumber: 9
                    }, this),
                    ' ',
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        component: "span",
                        sx: {
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 800
                        },
                        children: "Agency"
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 531,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                lineNumber: 524,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 4,
                    mb: GAP,
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            flex: 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                height: 8,
                                bgcolor: 'grey.300',
                                borderRadius: 5,
                                overflow: 'hidden'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    width: "".concat(overallCompletion, "%"),
                                    height: '100%',
                                    bgcolor: theme.palette.primary.main,
                                    borderRadius: 5,
                                    transition: 'width 600ms cubic-bezier(0.16,1,0.3,1), background-color 300ms ease',
                                    boxShadow: barAnimate ? "0 0 12px ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.primary.main, 0.5), ", 0 0 24px ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.primary.main, 0.35)) : 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                lineNumber: 543,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                            lineNumber: 542,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 541,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            minWidth: 48,
                            textAlign: 'right',
                            fontWeight: 600,
                            color: theme.palette.primary.main
                        },
                        children: [
                            overallCompletion,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 557,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                lineNumber: 540,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    position: 'relative',
                    flex: {
                        xs: '0 0 auto',
                        md: '1 1 auto'
                    },
                    overflowY: {
                        xs: 'visible',
                        md: 'auto'
                    },
                    overflowX: 'hidden',
                    height: 'auto',
                    minHeight: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        in: stepIndex === 0,
                        timeout: 300,
                        unmountOnExit: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                p: GAP,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                py: {
                                    xs: GAP,
                                    md: 1
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        fontWeight: 700,
                                        mb: GAP,
                                        textAlign: 'left',
                                        color: 'text.primary',
                                        fontSize: {
                                            xs: '1.1rem',
                                            md: '1.2rem'
                                        }
                                    },
                                    children: "Contact & Location"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 591,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    label: "Email",
                                    value: email,
                                    onChange: (e)=>setEmail(e.target.value),
                                    onFocus: ()=>setEmailFocused(true),
                                    onBlur: ()=>setEmailFocused(false),
                                    placeholder: "Company Email",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EmailOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                        lineNumber: 610,
                                        columnNumber: 21
                                    }, void 0),
                                    focusColor: theme.palette.primary.main,
                                    invalid: invalidEmail
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 603,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    in: emailFocused && !isEmail(email) && email.length > 0,
                                    timeout: 200,
                                    unmountOnExit: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "caption",
                                        sx: {
                                            color: 'error.main',
                                            pl: 1,
                                            mt: 0.5
                                        },
                                        children: "Please enter a valid email address."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                        lineNumber: 619,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 614,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        mt: 2
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            label: "Password",
                                            value: password,
                                            onChange: (e)=>setPassword(e.target.value),
                                            onFocus: ()=>setPwFocused(true),
                                            onBlur: ()=>setPwFocused(false),
                                            placeholder: "Password",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LockOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 632,
                                                columnNumber: 23
                                            }, void 0),
                                            focusColor: theme.palette.primary.main,
                                            type: showPassword ? 'text' : 'password',
                                            endAdornment: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOffOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 636,
                                                columnNumber: 34
                                            }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 636,
                                                columnNumber: 66
                                            }, void 0),
                                            onEndAdornmentClick: ()=>setShowPassword((v)=>!v),
                                            invalid: invalidPassword
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 625,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            in: pwFocused,
                                            timeout: 200,
                                            unmountOnExit: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                sx: {
                                                    mt: 1,
                                                    pl: 1
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            display: 'block',
                                                            color: pwRules.len ? 'success.main' : 'error.main'
                                                        },
                                                        children: "• At least 8 characters"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 643,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            display: 'block',
                                                            color: pwRules.upper ? 'success.main' : 'error.main'
                                                        },
                                                        children: "• At least one uppercase letter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 649,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            display: 'block',
                                                            color: pwRules.lower ? 'success.main' : 'error.main'
                                                        },
                                                        children: "• At least one lowercase letter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 655,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            display: 'block',
                                                            color: pwRules.number ? 'success.main' : 'error.main'
                                                        },
                                                        children: "• At least one number"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 661,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            display: 'block',
                                                            color: pwRules.special ? 'success.main' : 'error.main'
                                                        },
                                                        children: "• At least one special symbol"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 667,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 642,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 641,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                mt: 2
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    label: "Confirm Password",
                                                    value: confirmPassword,
                                                    onChange: (e)=>setConfirmPassword(e.target.value),
                                                    onFocus: ()=>setConfirmFocused(true),
                                                    onBlur: ()=>setConfirmFocused(false),
                                                    placeholder: "Re-enter password",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LockOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 686,
                                                        columnNumber: 25
                                                    }, void 0),
                                                    focusColor: theme.palette.primary.main,
                                                    type: showConfirmPw ? 'text' : 'password',
                                                    endAdornment: showConfirmPw ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOffOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 690,
                                                        columnNumber: 37
                                                    }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 690,
                                                        columnNumber: 69
                                                    }, void 0),
                                                    onEndAdornmentClick: ()=>setShowConfirmPw((v)=>!v),
                                                    invalid: invalidConfirm
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 679,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    in: confirmFocused && confirmPassword.length > 0 && confirmPassword !== password,
                                                    timeout: 200,
                                                    unmountOnExit: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            color: 'error.main',
                                                            pl: 1,
                                                            mt: 0.5
                                                        },
                                                        children: "Passwords do not match."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 700,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 695,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 678,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 624,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        display: 'flex',
                                        gap: GAP,
                                        mt: GAP,
                                        flexDirection: {
                                            xs: 'column',
                                            md: 'row'
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                flex: 1
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    label: "Primary Contact First Name",
                                                    value: firstName,
                                                    onChange: (e)=>setFirstName(e.target.value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, '')),
                                                    onFocus: ()=>setFirstFocused(true),
                                                    onBlur: ()=>setFirstFocused(false),
                                                    placeholder: "Primary Contact First Name",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 730,
                                                        columnNumber: 25
                                                    }, void 0),
                                                    focusColor: theme.palette.primary.main,
                                                    invalid: invalidFirst
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 716,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    in: firstFocused && firstName.length > 0 && !isLettersOnly(firstName),
                                                    timeout: 200,
                                                    unmountOnExit: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            color: 'error.main',
                                                            pl: 1,
                                                            mt: 0.5
                                                        },
                                                        children: "Use letters only for first name."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 739,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 734,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 715,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                flex: 1
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    label: "Primary Contact Last Name",
                                                    value: lastName,
                                                    onChange: (e)=>setLastName(e.target.value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, '')),
                                                    onFocus: ()=>setLastFocused(true),
                                                    onBlur: ()=>setLastFocused(false),
                                                    placeholder: "Primary Contact Last Name",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 759,
                                                        columnNumber: 25
                                                    }, void 0),
                                                    focusColor: theme.palette.primary.main,
                                                    invalid: invalidLast
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 745,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    in: lastFocused && lastName.length > 0 && !isLettersOnly(lastName),
                                                    timeout: 200,
                                                    unmountOnExit: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            color: 'error.main',
                                                            pl: 1,
                                                            mt: 0.5
                                                        },
                                                        children: "Use letters only for last name."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 768,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 763,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 744,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 707,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        display: 'flex',
                                        gap: GAP,
                                        mt: GAP
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                flex: 1
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                options: phonePrefixOptions,
                                                value: phonePrefix,
                                                onChange: (v)=>setPhonePrefix(v),
                                                label: "Prefix",
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AddOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 782,
                                                    columnNumber: 25
                                                }, void 0),
                                                focusColor: theme.palette.primary.main
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 777,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 776,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                flex: 1
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    label: "Phone",
                                                    value: phoneNumber,
                                                    onChange: (e)=>setPhoneNumber(e.target.value.replace(/\D/g, '')),
                                                    onFocus: ()=>setPhoneFocused(true),
                                                    onBlur: ()=>setPhoneFocused(false),
                                                    placeholder: "Phone Number",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PhoneIphoneOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 796,
                                                        columnNumber: 25
                                                    }, void 0),
                                                    focusColor: theme.palette.primary.main,
                                                    invalid: invalidPhone
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 787,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    in: phoneFocused && phoneNumber.length > 0 && (!isDigits(phoneNumber) || !isNineDigits(phoneNumber)),
                                                    timeout: 200,
                                                    unmountOnExit: true,
                                                    children: !isDigits(phoneNumber) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            color: 'error.main',
                                                            pl: 1,
                                                            mt: 0.5
                                                        },
                                                        children: "Digits only for phone number."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 810,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            color: 'error.main',
                                                            pl: 1,
                                                            mt: 0.5
                                                        },
                                                        children: "Enter exactly 9 digits."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                        lineNumber: 814,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 800,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 786,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 775,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        mt: GAP
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        options: countries.map((c)=>({
                                                value: c.id,
                                                label: c.name
                                            })),
                                        value: selectedCountryId !== null && selectedCountryId !== void 0 ? selectedCountryId : '',
                                        onChange: (v)=>setSelectedCountryById(typeof v === 'number' ? v : ''),
                                        label: "Country",
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 828,
                                            columnNumber: 23
                                        }, void 0),
                                        focusColor: theme.palette.primary.main
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                        lineNumber: 823,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 822,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        display: 'flex',
                                        gap: GAP,
                                        mt: GAP
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                flex: 1
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                options: [
                                                    {
                                                        value: 0,
                                                        label: 'No state'
                                                    },
                                                    ...states.map((s)=>({
                                                            value: s.id,
                                                            label: s.name
                                                        }))
                                                ],
                                                value: selectedStateId !== null && selectedStateId !== void 0 ? selectedStateId : '',
                                                onChange: (v)=>setSelectedStateById(typeof v === 'number' ? v : ''),
                                                label: "State",
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 843,
                                                    columnNumber: 25
                                                }, void 0),
                                                focusColor: theme.palette.primary.main,
                                                disabled: selectedCountryId === ''
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 835,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 834,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                flex: 1
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                options: cities.map((c)=>({
                                                        value: c.id,
                                                        label: c.name
                                                    })),
                                                value: selectedCityId !== null && selectedCityId !== void 0 ? selectedCityId : '',
                                                onChange: (v)=>setSelectedCityById(typeof v === 'number' ? v : ''),
                                                label: "City",
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                    lineNumber: 854,
                                                    columnNumber: 25
                                                }, void 0),
                                                focusColor: theme.palette.primary.main,
                                                disabled: selectedCountryId === ''
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 849,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 848,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 833,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        mt: GAP
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            label: "Office Street Address",
                                            value: officeStreetAddress,
                                            onChange: (e)=>setOfficeStreetAddress(e.target.value),
                                            onFocus: ()=>setStreetFocused(true),
                                            onBlur: ()=>setStreetFocused(false),
                                            placeholder: "Office Street Address",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 869,
                                                columnNumber: 23
                                            }, void 0),
                                            focusColor: theme.palette.primary.main,
                                            invalid: invalidStreet
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 862,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            in: streetFocused && officeStreetAddress.length > 0 && officeStreetAddress.trim().length <= 15,
                                            timeout: 200,
                                            unmountOnExit: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    color: 'error.main',
                                                    pl: 1,
                                                    mt: 0.5
                                                },
                                                children: "Street address must be at least 16 characters."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                                lineNumber: 882,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                            lineNumber: 873,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 861,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                            lineNumber: 582,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 581,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        in: stepIndex === 1,
                        timeout: 300,
                        unmountOnExit: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                p: GAP,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                py: {
                                    xs: GAP,
                                    md: 1
                                }
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$agencySteps$2f$AgencyCompanyInfoStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                companyName: companyName,
                                setCompanyName: setCompanyName,
                                licenseNumber: licenseNumber,
                                setLicenseNumber: setLicenseNumber,
                                establishedYear: establishedYear,
                                setEstablishedYear: setEstablishedYear,
                                companyType: companyType,
                                setCompanyType: setCompanyType,
                                companyWebsite: companyWebsite,
                                setCompanyWebsite: setCompanyWebsite
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                lineNumber: 901,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                            lineNumber: 892,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 891,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        in: stepIndex === 2,
                        timeout: 300,
                        unmountOnExit: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                p: GAP,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                py: {
                                    xs: GAP,
                                    md: 1
                                }
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$agencySteps$2f$AgencyBusinessProfileStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                primaryMarkets: primaryMarkets,
                                setPrimaryMarkets: setPrimaryMarkets,
                                yearlyTransactions: yearlyTransactions,
                                setYearlyTransactions: setYearlyTransactions,
                                averagePropertyValue: averagePropertyValue,
                                setAveragePropertyValue: setAveragePropertyValue,
                                experienceExpertise: experienceExpertise,
                                setExperienceExpertise: setExperienceExpertise,
                                notableProjects: notableProjects,
                                setNotableProjects: setNotableProjects,
                                currency: avgCurrency,
                                setCurrency: setAvgCurrency
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                lineNumber: 927,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                            lineNumber: 918,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 917,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        in: stepIndex === 3,
                        timeout: 300,
                        unmountOnExit: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                p: GAP,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                py: {
                                    xs: GAP,
                                    md: 1
                                }
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$agencySteps$2f$AgencyPartnershipGoalsStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                partnershipReason: partnershipReason,
                                setPartnershipReason: setPartnershipReason,
                                regionPreferences: regionPreferences,
                                setRegionPreferences: setRegionPreferences,
                                targetClients: targetClients,
                                setTargetClients: setTargetClients,
                                servicesProvided: servicesProvided,
                                setServicesProvided: setServicesProvided,
                                additionalInterests: additionalInterests,
                                setAdditionalInterests: setAdditionalInterests
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                lineNumber: 955,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                            lineNumber: 946,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 945,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                lineNumber: 570,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    mt: 1,
                    pt: GAP,
                    pb: {
                        xs: 4,
                        md: 4
                    },
                    maxWidth: 640,
                    mx: 'auto',
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            display: 'flex',
                            gap: {
                                xs: 1.5,
                                md: 2
                            },
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexWrap: 'nowrap'
                        },
                        children: [
                            stepIndex > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    flex: 'none'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    "aria-label": "Back",
                                    onClick: ()=>setStepIndex((s)=>Math.max(0, s - 1)),
                                    startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ArrowBackIosNew$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            color: '#fff'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                        lineNumber: 987,
                                        columnNumber: 28
                                    }, void 0),
                                    disableElevation: true,
                                    sx: {
                                        height: {
                                            xs: 42,
                                            md: 48
                                        },
                                        width: {
                                            xs: 42,
                                            md: 48
                                        },
                                        minWidth: 0,
                                        px: 1.25,
                                        border: 'none',
                                        outline: 'none',
                                        textTransform: 'none',
                                        fontFamily: 'Montserrat, sans-serif',
                                        fontSize: {
                                            xs: '12px',
                                            sm: '13px',
                                            md: '14px',
                                            lg: '18px'
                                        },
                                        fontWeight: 700,
                                        color: '#fff',
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: {
                                            xs: '12px',
                                            lg: '16px'
                                        },
                                        justifyContent: 'center',
                                        '& .MuiButton-startIcon': {
                                            mr: 0
                                        },
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark
                                        },
                                        '&:focus-visible': {
                                            outline: 'none'
                                        }
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 984,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                lineNumber: 983,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    flex: 1,
                                    minWidth: {
                                        xs: 0,
                                        md: 240
                                    }
                                },
                                children: stepIndex < 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Glare$2f$Glare$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    shouldPlay: isCurrentStepComplete,
                                    glareColor: theme.palette.common.white,
                                    glareOpacity: 0.5,
                                    glareAngle: -30,
                                    glareSize: 380,
                                    transitionDuration: 900,
                                    style: {
                                        width: '100%'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        label: "Continue",
                                        onClick: ()=>setStepIndex((s)=>Math.min(3, s + 1)),
                                        color: "primary",
                                        disabled: !isCurrentStepComplete,
                                        containerSx: {
                                            width: '100%'
                                        },
                                        sx: {
                                            fontWeight: 700,
                                            px: 5,
                                            whiteSpace: 'nowrap'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                        lineNumber: 1023,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 1014,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Glare$2f$Glare$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    shouldPlay: isFormComplete,
                                    glareColor: theme.palette.common.white,
                                    glareOpacity: 0.5,
                                    glareAngle: -30,
                                    glareSize: 380,
                                    transitionDuration: 900,
                                    style: {
                                        width: '100%'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        label: "Create Account",
                                        onClick: handleSubmit,
                                        color: "primary",
                                        disabled: !isFormComplete,
                                        containerSx: {
                                            width: '100%'
                                        },
                                        sx: {
                                            fontWeight: 700,
                                            px: 5,
                                            whiteSpace: 'nowrap'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                        lineNumber: 1042,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                    lineNumber: 1033,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                lineNumber: 1012,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 973,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            mt: GAP,
                            color: 'text.secondary',
                            textAlign: 'center',
                            fontSize: {
                                xs: '14px',
                                lg: '18px'
                            }
                        },
                        children: [
                            "Already have an Agency account?",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                style: {
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    textDecoration: 'none'
                                },
                                children: "Log in"
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                                lineNumber: 1063,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                        lineNumber: 1054,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/signUpAsAgency.tsx",
                lineNumber: 972,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/register/signUpAsAgency.tsx",
        lineNumber: 509,
        columnNumber: 5
    }, this);
}
_s(SignUpAsAgency, "VSOxlmYlMGsJFJ6Q6LsEjFDlIxw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = SignUpAsAgency;
var _c;
__turbopack_context__.k.register(_c, "SignUpAsAgency");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/utils/dateInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DateInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Input$2f$Input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Input/Input.js [app-client] (ecmascript) <export default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EventOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/EventOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/grey.js [app-client] (ecmascript) <export default as grey>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function DateInput(param) {
    let { focusColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700], icon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EventOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500]
        }
    }, void 0, false, {
        fileName: "[project]/app/components/utils/dateInput.tsx",
        lineNumber: 29,
        columnNumber: 10
    }, this), label = '', value = '', onChange = ()=>{}, onFocus, onBlur, placeholder = '', disabled = false, locked = false, endAdornment, onEndAdornmentClick, invalid = false, min, max, bgColor, textColor } = param;
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const isDisabled = disabled || locked;
    const resolvedBg = isDisabled ? theme.palette.grey[200] : invalid ? '#ffebee' : bgColor !== null && bgColor !== void 0 ? bgColor : theme.palette.background.default;
    const resolvedText = textColor !== null && textColor !== void 0 ? textColor : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][700];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: {
                xs: '32px',
                lg: '40px'
            },
            bgcolor: resolvedBg,
            mx: 0,
            borderRadius: {
                xs: '12px',
                lg: '16px'
            },
            color: resolvedText,
            boxShadow: "0 3px 0 ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][300]),
            px: {
                xs: 1,
                lg: 2
            },
            py: {
                xs: 1,
                lg: 2
            },
            ...isDisabled ? {} : {
                '&:focus-within': {
                    boxShadow: "0 3px 0 ".concat(focusColor)
                }
            },
            cursor: isDisabled ? 'not-allowed' : 'text',
            opacity: isDisabled ? 0.95 : 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    display: 'flex',
                    alignItems: 'center',
                    color: isDisabled ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500] : focusColor
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/components/utils/dateInput.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Input$2f$Input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                disableUnderline: true,
                value: value,
                onChange: onChange,
                onFocus: onFocus,
                onBlur: onBlur,
                placeholder: placeholder,
                type: "text",
                "aria-label": label,
                disabled: isDisabled,
                inputProps: {
                    min,
                    max,
                    inputMode: 'numeric',
                    pattern: '[0-9/]*'
                },
                sx: {
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: {
                        xs: '14px',
                        lg: '16px'
                    },
                    paddingLeft: 2,
                    flex: 1,
                    color: isDisabled ? 'text.disabled' : resolvedText
                }
            }, void 0, false, {
                fileName: "[project]/app/components/utils/dateInput.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            endAdornment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                onClick: onEndAdornmentClick,
                sx: {
                    ml: 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: isDisabled ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$grey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__grey$3e$__["grey"][500] : focusColor,
                    cursor: onEndAdornmentClick ? 'pointer' : 'default'
                },
                children: endAdornment
            }, void 0, false, {
                fileName: "[project]/app/components/utils/dateInput.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/utils/dateInput.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(DateInput, "VrMvFCCB9Haniz3VCRPNUiCauHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = DateInput;
var _c;
__turbopack_context__.k.register(_c, "DateInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/register/signUpAsInvestor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignUpAsInvestor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Collapse/Collapse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EmailOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/EmailOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LockOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/LockOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PersonOutlineOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AddOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/AddOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PhoneIphoneOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PhoneIphoneOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/VisibilityOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOffOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/VisibilityOffOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PublicOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/autocomplete.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Glare$2f$Glare$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/reactDevBits/Glare/Glare.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$dateInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/utils/dateInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EventOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/EventOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/system/esm/colorManipulator/colorManipulator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function SignUpAsInvestor(props) {
    _s();
    const { countries, states, cities, selectedCountryId, selectedStateId, selectedCityId, setSelectedCountryById, setSelectedStateById, setSelectedCityById, email, setEmail, password, setPassword, firstName, setFirstName, lastName, setLastName, phonePrefix, setPhonePrefix, phoneNumber, setPhoneNumber, birthDate, setBirthDate, onSubmit } = props;
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    const phonePrefixOptions = [
        '+1',
        '+7',
        '+20',
        '+27',
        '+30',
        '+31',
        '+32',
        '+33',
        '+34',
        '+36',
        '+39',
        '+40',
        '+41',
        '+43',
        '+44',
        '+45',
        '+46',
        '+47',
        '+48',
        '+49',
        '+52',
        '+55',
        '+57',
        '+60',
        '+61',
        '+62',
        '+63',
        '+64',
        '+65',
        '+66',
        '+81',
        '+82',
        '+84',
        '+86',
        '+90',
        '+91',
        '+92',
        '+94',
        '+351',
        '+352',
        '+353',
        '+354',
        '+355',
        '+356',
        '+358',
        '+359',
        '+370',
        '+371',
        '+372',
        '+380',
        '+386',
        '+420',
        '+421'
    ].map((p)=>({
            value: p,
            label: p
        }));
    const GAP = 2;
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showConfirmPw, setShowConfirmPw] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pwFocused, setPwFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmFocused, setConfirmFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [emailFocused, setEmailFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [firstFocused, setFirstFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastFocused, setLastFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [phoneFocused, setPhoneFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [birthFocused, setBirthFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hiddenNativeDateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isLettersOnly = (s)=>/^[A-Za-z\u00C0-\u017F\s'-]+$/.test(s);
    const isEmail = (s)=>/.+@.+\..+/.test(s);
    const isDigits = (s)=>/^\d+$/.test(s);
    const isNineDigits = (s)=>/^\d{9}$/.test(s);
    const formatDob = (input)=>{
        const d = input.replace(/\D/g, '').slice(0, 8);
        if (d.length <= 2) return d;
        if (d.length <= 4) return "".concat(d.slice(0, 2), "/").concat(d.slice(2));
        return "".concat(d.slice(0, 2), "/").concat(d.slice(2, 4), "/").concat(d.slice(4));
    };
    const isAdult = (dateStr)=>{
        if (!dateStr) return false;
        const matchParts = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!matchParts) return false;
        const [, dd, mm, yyyy] = matchParts;
        const dob = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
        if (Number.isNaN(dob.getTime())) return false;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDelta = today.getMonth() - dob.getMonth();
        if (monthDelta < 0 || monthDelta === 0 && today.getDate() < dob.getDate()) age--;
        return age >= 18;
    };
    const compareByName = (a, b)=>{
        const an = a.name.toUpperCase();
        const bn = b.name.toUpperCase();
        if (an < bn) return -1;
        if (an > bn) return 1;
        return 0;
    };
    const completion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsInvestor.useMemo[completion]": ()=>{
            const step1 = email.includes('@') && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8 && confirmPassword.length > 0 && confirmPassword === password;
            const step2 = firstName.trim().length > 0 && lastName.trim().length > 0 && isAdult(birthDate);
            const step3 = String(phonePrefix).trim().length > 0 && isNineDigits(phoneNumber.trim());
            const step4 = selectedCountryId !== '' && selectedCityId !== '';
            const done = [
                step1,
                step2,
                step3,
                step4
            ].filter(Boolean).length;
            return done * 25;
        }
    }["SignUpAsInvestor.useMemo[completion]"], [
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        birthDate,
        phonePrefix,
        phoneNumber,
        selectedCountryId,
        selectedCityId
    ]);
    // Progress bar animation trigger when completion increases
    const [lastCompletion, setLastCompletion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(completion);
    const [barAnimate, setBarAnimate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignUpAsInvestor.useEffect": ()=>{
            if (completion > lastCompletion) {
                setBarAnimate(true);
                const t = setTimeout({
                    "SignUpAsInvestor.useEffect.t": ()=>setBarAnimate(false)
                }["SignUpAsInvestor.useEffect.t"], 700);
                setLastCompletion(completion);
                return ({
                    "SignUpAsInvestor.useEffect": ()=>clearTimeout(t)
                })["SignUpAsInvestor.useEffect"];
            }
            if (completion !== lastCompletion) setLastCompletion(completion);
        }
    }["SignUpAsInvestor.useEffect"], [
        completion,
        lastCompletion
    ]);
    const isFormComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsInvestor.useMemo[isFormComplete]": ()=>{
            return email.includes('@') && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8 && confirmPassword.length > 0 && confirmPassword === password && firstName.trim().length > 0 && lastName.trim().length > 0 && isAdult(birthDate) && String(phonePrefix).trim().length > 0 && isNineDigits(phoneNumber.trim()) && selectedCountryId !== '' && selectedCityId !== '';
        }
    }["SignUpAsInvestor.useMemo[isFormComplete]"], [
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        birthDate,
        phonePrefix,
        phoneNumber,
        selectedCountryId,
        selectedCityId
    ]);
    const pwRules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SignUpAsInvestor.useMemo[pwRules]": ()=>({
                len: password.length >= 8,
                upper: /[A-Z]/.test(password),
                lower: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[^A-Za-z0-9]/.test(password)
            })
    }["SignUpAsInvestor.useMemo[pwRules]"], [
        password
    ]);
    const invalidEmail = !isEmail(email) && !emailFocused && email.length > 0;
    const invalidPassword = !(pwRules.len && pwRules.upper && pwRules.lower && pwRules.number && pwRules.special) && !pwFocused && password.length > 0;
    const invalidConfirm = confirmPassword.length > 0 && confirmPassword !== password && !confirmFocused;
    const invalidFirst = firstName.length > 0 && !isLettersOnly(firstName) && !firstFocused;
    const invalidLast = lastName.length > 0 && !isLettersOnly(lastName) && !lastFocused;
    const invalidPhone = phoneNumber.length > 0 && (!isDigits(phoneNumber) || !isNineDigits(phoneNumber)) && !phoneFocused;
    const invalidBirth = birthDate.length > 0 && !isAdult(birthDate) && !birthFocused;
    return(// UPDATED: Root box now takes full viewport height and hides any overflow
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            pt: {
                xs: '24px',
                md: '80px'
            },
            px: {
                xs: 3,
                md: 4
            },
            width: '100%',
            maxWidth: {
                xs: '100%',
                md: '100%'
            },
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: {
                xs: 'auto',
                md: '100vh'
            },
            overflow: {
                xs: 'visible',
                md: 'hidden'
            }
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                variant: "h4",
                sx: {
                    mb: 0,
                    fontWeight: 700,
                    textAlign: 'center',
                    flexShrink: 0,
                    fontSize: {
                        xs: '1.5rem',
                        md: '2rem'
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        component: "span",
                        sx: {
                            color: theme.palette.secondary.main,
                            fontWeight: 700
                        },
                        children: "Sign up as"
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this),
                    ' ',
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        component: "span",
                        sx: {
                            color: theme.palette.secondary.main,
                            textDecoration: 'none',
                            fontWeight: 800
                        },
                        children: "Investor"
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                lineNumber: 292,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 4,
                    mb: GAP,
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            flex: 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                height: 8,
                                bgcolor: 'grey.300',
                                borderRadius: 5,
                                overflow: 'hidden'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    width: "".concat(completion, "%"),
                                    height: '100%',
                                    bgcolor: theme.palette.secondary.main,
                                    borderRadius: 5,
                                    transition: 'width 600ms cubic-bezier(0.16,1,0.3,1), background-color 300ms ease',
                                    boxShadow: barAnimate ? "0 0 12px ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.secondary.main, 0.5), ", 0 0 24px ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$system$2f$esm$2f$colorManipulator$2f$colorManipulator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alpha"])(theme.palette.secondary.main, 0.35)) : 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 316,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            minWidth: 48,
                            textAlign: 'right',
                            fontWeight: 600,
                            color: theme.palette.secondary.main
                        },
                        children: [
                            completion,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    flex: {
                        xs: '0 0 auto',
                        md: '1 1 auto'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    overflowY: {
                        xs: 'visible',
                        md: 'auto'
                    },
                    overflowX: 'hidden',
                    p: GAP
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Email",
                            value: email,
                            onChange: (e)=>setEmail(e.target.value),
                            onFocus: ()=>setEmailFocused(true),
                            onBlur: ()=>setEmailFocused(false),
                            placeholder: "Email",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EmailOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                lineNumber: 365,
                                columnNumber: 19
                            }, void 0),
                            focusColor: theme.palette.secondary.main,
                            invalid: invalidEmail
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 358,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            in: emailFocused && !isEmail(email) && email.length > 0,
                            timeout: 200,
                            unmountOnExit: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "caption",
                                sx: {
                                    color: 'error.main',
                                    pl: 1,
                                    mt: 0.5
                                },
                                children: "Please enter a valid email address."
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                lineNumber: 374,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 369,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                mt: 2
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    label: "Password",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    onFocus: ()=>setPwFocused(true),
                                    onBlur: ()=>setPwFocused(false),
                                    placeholder: "Password",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LockOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 388,
                                        columnNumber: 21
                                    }, void 0),
                                    focusColor: theme.palette.secondary.main,
                                    type: showPassword ? 'text' : 'password',
                                    endAdornment: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOffOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 392,
                                        columnNumber: 32
                                    }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 392,
                                        columnNumber: 64
                                    }, void 0),
                                    onEndAdornmentClick: ()=>setShowPassword((v)=>!v),
                                    invalid: invalidPassword
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 381,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    in: pwFocused,
                                    timeout: 200,
                                    unmountOnExit: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            mt: 1,
                                            pl: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    display: 'block',
                                                    color: pwRules.len ? 'success.main' : 'error.main'
                                                },
                                                children: "• At least 8 characters"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 399,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    display: 'block',
                                                    color: pwRules.upper ? 'success.main' : 'error.main'
                                                },
                                                children: "• At least one uppercase letter"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 405,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    display: 'block',
                                                    color: pwRules.lower ? 'success.main' : 'error.main'
                                                },
                                                children: "• At least one lowercase letter"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 411,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    display: 'block',
                                                    color: pwRules.number ? 'success.main' : 'error.main'
                                                },
                                                children: "• At least one number"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 417,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    display: 'block',
                                                    color: pwRules.special ? 'success.main' : 'error.main'
                                                },
                                                children: "• At least one special symbol"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 423,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 398,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 397,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        mt: 2
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            label: "Confirm Password",
                                            value: confirmPassword,
                                            onChange: (e)=>setConfirmPassword(e.target.value),
                                            onFocus: ()=>setConfirmFocused(true),
                                            onBlur: ()=>setConfirmFocused(false),
                                            placeholder: "Re-enter password",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LockOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 439,
                                                columnNumber: 23
                                            }, void 0),
                                            focusColor: theme.palette.secondary.main,
                                            type: showConfirmPw ? 'text' : 'password',
                                            endAdornment: showConfirmPw ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOffOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 443,
                                                columnNumber: 35
                                            }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 443,
                                                columnNumber: 67
                                            }, void 0),
                                            onEndAdornmentClick: ()=>setShowConfirmPw((v)=>!v),
                                            invalid: invalidConfirm
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 432,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            in: confirmFocused && confirmPassword.length > 0 && confirmPassword !== password,
                                            timeout: 200,
                                            unmountOnExit: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    color: 'error.main',
                                                    pl: 1,
                                                    mt: 0.5
                                                },
                                                children: "Passwords do not match."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 453,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 448,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 431,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 380,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    md: '1fr 1fr'
                                },
                                gap: GAP,
                                mt: GAP
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        flex: 1
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            label: "First Name",
                                            value: firstName,
                                            onChange: (e)=>setFirstName(e.target.value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, '')),
                                            onFocus: ()=>setFirstFocused(true),
                                            onBlur: ()=>setFirstFocused(false),
                                            placeholder: "First Name",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 481,
                                                columnNumber: 23
                                            }, void 0),
                                            focusColor: theme.palette.secondary.main,
                                            invalid: invalidFirst
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 470,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            in: firstFocused && firstName.length > 0 && !isLettersOnly(firstName),
                                            timeout: 200,
                                            unmountOnExit: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    color: 'error.main',
                                                    pl: 1,
                                                    mt: 0.5
                                                },
                                                children: "Use letters only for first name."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 490,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 485,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 469,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        flex: 1
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            label: "Last Name",
                                            value: lastName,
                                            onChange: (e)=>setLastName(e.target.value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, '')),
                                            onFocus: ()=>setLastFocused(true),
                                            onBlur: ()=>setLastFocused(false),
                                            placeholder: "Last Name",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PersonOutlineOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 507,
                                                columnNumber: 23
                                            }, void 0),
                                            focusColor: theme.palette.secondary.main,
                                            invalid: invalidLast
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 496,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            in: lastFocused && lastName.length > 0 && !isLettersOnly(lastName),
                                            timeout: 200,
                                            unmountOnExit: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    color: 'error.main',
                                                    pl: 1,
                                                    mt: 0.5
                                                },
                                                children: "Use letters only for last name."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 516,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 511,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 495,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 461,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                mt: GAP
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$dateInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: birthDate,
                                    onChange: (e)=>setBirthDate(formatDob(e.target.value)),
                                    onFocus: ()=>setBirthFocused(true),
                                    onBlur: ()=>setBirthFocused(false),
                                    placeholder: "Birth Date (DD/MM/YYYY)",
                                    focusColor: theme.palette.secondary.main,
                                    invalid: invalidBirth,
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EventOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            color: theme.palette.secondary.main
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 535,
                                        columnNumber: 21
                                    }, void 0),
                                    endAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$EventOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            color: theme.palette.secondary.main
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 536,
                                        columnNumber: 29
                                    }, void 0),
                                    onEndAdornmentClick: ()=>{
                                        const el = hiddenNativeDateRef.current;
                                        if (!el) return;
                                        const picker = el.showPicker;
                                        if (typeof picker === 'function') {
                                            picker.call(el);
                                        } else {
                                            el.focus();
                                            el.click();
                                        }
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 525,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    ref: hiddenNativeDateRef,
                                    type: "date",
                                    style: {
                                        position: 'absolute',
                                        opacity: 0,
                                        width: 0,
                                        height: 0,
                                        pointerEvents: 'none'
                                    },
                                    max: new Date().toISOString().slice(0, 10),
                                    onChange: (e)=>{
                                        const val = e.target.value; // yyyy-mm-dd
                                        if (val) {
                                            const [y, m, d] = val.split('-');
                                            setBirthDate("".concat(d, "/").concat(m, "/").concat(y));
                                        }
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 549,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    in: birthFocused && birthDate.length > 0 && !isAdult(birthDate),
                                    timeout: 200,
                                    unmountOnExit: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "caption",
                                        sx: {
                                            color: 'error.main',
                                            pl: 1,
                                            mt: 0.5
                                        },
                                        children: "You must be at least 18 years old."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 573,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 568,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 524,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                display: 'flex',
                                gap: GAP,
                                mt: GAP
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        flex: 1
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        options: phonePrefixOptions,
                                        value: phonePrefix,
                                        onChange: (v)=>setPhonePrefix(v),
                                        label: "Prefix",
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AddOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 587,
                                            columnNumber: 23
                                        }, void 0),
                                        focusColor: theme.palette.secondary.main,
                                        selectedColor: theme.palette.secondary.light
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 582,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 581,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        flex: 1
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            label: "Phone",
                                            value: phoneNumber,
                                            onChange: (e)=>setPhoneNumber(e.target.value.replace(/\D/g, '')),
                                            onFocus: ()=>setPhoneFocused(true),
                                            onBlur: ()=>setPhoneFocused(false),
                                            placeholder: "Phone Number",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PhoneIphoneOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 602,
                                                columnNumber: 23
                                            }, void 0),
                                            focusColor: theme.palette.secondary.main,
                                            invalid: invalidPhone
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 593,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            in: phoneFocused && phoneNumber.length > 0 && (!isDigits(phoneNumber) || !isNineDigits(phoneNumber)),
                                            timeout: 200,
                                            unmountOnExit: true,
                                            children: !isDigits(phoneNumber) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    color: 'error.main',
                                                    pl: 1,
                                                    mt: 0.5
                                                },
                                                children: "Digits only for phone number."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 616,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "caption",
                                                sx: {
                                                    color: 'error.main',
                                                    pl: 1,
                                                    mt: 0.5
                                                },
                                                children: "Enter exactly 9 digits."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                                lineNumber: 620,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 606,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 592,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 580,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                mt: GAP
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                options: [
                                    ...countries
                                ].sort(compareByName).map((c)=>({
                                        value: c.id,
                                        label: c.name
                                    })),
                                value: selectedCountryId !== null && selectedCountryId !== void 0 ? selectedCountryId : '',
                                onChange: (v)=>setSelectedCountryById(typeof v === 'number' ? v : ''),
                                label: "Country",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 637,
                                    columnNumber: 21
                                }, void 0),
                                focusColor: theme.palette.secondary.main,
                                selectedColor: theme.palette.secondary.light
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                lineNumber: 630,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 629,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                display: 'flex',
                                gap: GAP,
                                mt: GAP
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        flex: 1
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        options: [
                                            {
                                                value: 0,
                                                label: 'No state'
                                            },
                                            ...[
                                                ...states
                                            ].sort(compareByName).map((s)=>({
                                                    value: s.id,
                                                    label: s.name
                                                }))
                                        ],
                                        value: selectedStateId !== null && selectedStateId !== void 0 ? selectedStateId : '',
                                        onChange: (v)=>setSelectedStateById(typeof v === 'number' ? v : ''),
                                        label: "State",
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 654,
                                            columnNumber: 23
                                        }, void 0),
                                        focusColor: theme.palette.secondary.main,
                                        selectedColor: theme.palette.secondary.light,
                                        disabled: selectedCountryId === ''
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 646,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 645,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        flex: 1
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        options: [
                                            ...cities
                                        ].sort(compareByName).map((c)=>({
                                                value: c.id,
                                                label: c.name
                                            })),
                                        value: selectedCityId !== null && selectedCityId !== void 0 ? selectedCityId : '',
                                        onChange: (v)=>setSelectedCityById(typeof v === 'number' ? v : ''),
                                        label: "City",
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PublicOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                            lineNumber: 668,
                                            columnNumber: 23
                                        }, void 0),
                                        focusColor: "#003FC7",
                                        selectedColor: "#6FA8FF",
                                        disabled: selectedCountryId === ''
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                        lineNumber: 661,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                    lineNumber: 660,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 644,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                    lineNumber: 356,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                lineNumber: 344,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    mt: 1,
                    pt: GAP,
                    pb: {
                        xs: 12,
                        md: 10
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                    maxWidth: 640,
                    mx: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$reactDevBits$2f$Glare$2f$Glare$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            shouldPlay: isFormComplete,
                            glareColor: theme.palette.common.white,
                            glareOpacity: 0.5,
                            glareAngle: -30,
                            glareSize: 380,
                            transitionDuration: 900,
                            style: {
                                flex: 1,
                                minWidth: 240
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$utils$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Create Account",
                                onClick: onSubmit,
                                color: "secondary",
                                disabled: !isFormComplete,
                                sx: {
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                lineNumber: 702,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                            lineNumber: 693,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                        lineNumber: 692,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            mt: GAP,
                            textAlign: 'center',
                            color: 'text.secondary',
                            fontSize: {
                                xs: '14px',
                                lg: '18px'
                            }
                        },
                        children: [
                            "Already have an Investor account?",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                style: {
                                    fontWeight: 700,
                                    color: theme.palette.secondary.main,
                                    textDecoration: 'none'
                                },
                                children: "Log in"
                            }, void 0, false, {
                                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                                lineNumber: 720,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                        lineNumber: 711,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
                lineNumber: 679,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/register/signUpAsInvestor.tsx",
        lineNumber: 278,
        columnNumber: 5
    }, this));
}
_s(SignUpAsInvestor, "eTGqlSW/sB01YN9iPGOt1tE5xj8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"]
    ];
});
_c = SignUpAsInvestor;
var _c;
__turbopack_context__.k.register(_c, "SignUpAsInvestor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(pages)/register/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegisterPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$enums$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/enums.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jwt-decode/build/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Dialog$2f$Dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Dialog/Dialog.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogTitle$2f$DialogTitle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/DialogTitle/DialogTitle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogContent$2f$DialogContent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/DialogContent/DialogContent.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogActions$2f$DialogActions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/DialogActions/DialogActions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$chooseAgency$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/register/chooseAgency.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$chooseInvestor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/register/chooseInvestor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$signUpAsAgency$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/register/signUpAsAgency.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$signUpAsInvestor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/register/signUpAsInvestor.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function RegisterPage() {
    _s();
    const [isAgencyRegister, setIsAgencyRegister] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileFormOpacity, setMobileFormOpacity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    // Mobile view transitions (fade out current form, then switch, then fade in)
    const onPreSelectMobile = ()=>setMobileFormOpacity(0);
    const onSelectAgencyMobile = ()=>{
        setIsAgencyRegister(true);
        setTimeout(()=>setMobileFormOpacity(1), 30);
    };
    const onSelectInvestorMobile = ()=>{
        setIsAgencyRegister(false);
        setTimeout(()=>setMobileFormOpacity(1), 30);
    };
    const [isResizing, setIsResizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const resizeTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [phoneNumber, setPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [phonePrefix, setPhonePrefix] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [firstName, setFirstName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [lastName, setLastName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [birthDate, setBirthDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''); // YYYY-MM-DD for investors
    const [role, setRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$enums$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoleEnum"].INVESTOR);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [countries, setCountries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [states, setStates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cities, setCities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [citiesByCountry, setCitiesByCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCountryId, setSelectedCountryId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedStateId, setSelectedStateId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCityId, setSelectedCityId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [showAgencyPrompt, setShowAgencyPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Prevent slide transition from replaying on zoom/resize by disabling it briefly
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RegisterPage.useEffect": ()=>{
            const onResize = {
                "RegisterPage.useEffect.onResize": ()=>{
                    setIsResizing(true);
                    if (resizeTimerRef.current) {
                        window.clearTimeout(resizeTimerRef.current);
                    }
                    resizeTimerRef.current = window.setTimeout({
                        "RegisterPage.useEffect.onResize": ()=>{
                            setIsResizing(false);
                            resizeTimerRef.current = null;
                        }
                    }["RegisterPage.useEffect.onResize"], 200);
                }
            }["RegisterPage.useEffect.onResize"];
            window.addEventListener('resize', onResize);
            return ({
                "RegisterPage.useEffect": ()=>{
                    window.removeEventListener('resize', onResize);
                    if (resizeTimerRef.current) {
                        window.clearTimeout(resizeTimerRef.current);
                    }
                }
            })["RegisterPage.useEffect"];
        }
    }["RegisterPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RegisterPage.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/countries/retrieve/get-all').then({
                "RegisterPage.useEffect": (response)=>setCountries(response.data)
            }["RegisterPage.useEffect"]);
        }
    }["RegisterPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RegisterPage.useEffect": ()=>{
            if (selectedCountryId !== '') {
                // Reset dependent selections when country changes
                setSelectedStateId('');
                setSelectedCityId('');
                // Fetch states for the country
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/states/retrieve/get-all/".concat(selectedCountryId)).then({
                    "RegisterPage.useEffect": (r)=>setStates(r.data || [])
                }["RegisterPage.useEffect"]).catch({
                    "RegisterPage.useEffect": ()=>setStates([])
                }["RegisterPage.useEffect"]);
                // Always fetch cities by country to show when no state is selected
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/cities/retrieve/get-all-by-country/".concat(selectedCountryId)).then({
                    "RegisterPage.useEffect": (r)=>{
                        const fetched = r.data || [];
                        const fetchedSorted = [
                            ...fetched
                        ].sort({
                            "RegisterPage.useEffect.fetchedSorted": (a, b)=>a.name.localeCompare(b.name, undefined, {
                                    sensitivity: 'base'
                                })
                        }["RegisterPage.useEffect.fetchedSorted"]);
                        setCitiesByCountry(fetchedSorted);
                        setCities(fetchedSorted);
                    }
                }["RegisterPage.useEffect"]).catch({
                    "RegisterPage.useEffect": ()=>{
                        setCitiesByCountry([]);
                        setCities([]);
                    }
                }["RegisterPage.useEffect"]);
            } else {
                setStates([]);
                setCitiesByCountry([]);
                setCities([]);
            }
        }
    }["RegisterPage.useEffect"], [
        selectedCountryId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RegisterPage.useEffect": ()=>{
            // Treat '' or 0 ("No state") as no state selected
            const hasState = selectedStateId !== '' && selectedStateId !== 0;
            if (hasState && states.length > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/cities/retrieve/get-all-by-state/".concat(selectedStateId)).then({
                    "RegisterPage.useEffect": (r)=>{
                        const data = r.data || [];
                        const sorted = [
                            ...data
                        ].sort({
                            "RegisterPage.useEffect.sorted": (a, b)=>a.name.localeCompare(b.name, undefined, {
                                    sensitivity: 'base'
                                })
                        }["RegisterPage.useEffect.sorted"]);
                        setCities(sorted);
                    }
                }["RegisterPage.useEffect"]).catch({
                    "RegisterPage.useEffect": ()=>setCities([])
                }["RegisterPage.useEffect"]);
            } else {
                // When no state (or "No state") is selected, default to cities by country
                setCities(citiesByCountry);
            }
        }
    }["RegisterPage.useEffect"], [
        selectedStateId,
        states.length,
        citiesByCountry
    ]);
    const handleUserRegister = async ()=>{
        // Combine prefix and number for a single E.164-like phone string
        const combinedPhone = "".concat(String(phonePrefix).trim()).concat(String(phoneNumber).trim());
        const isoBirthDate = (()=>{
            if (!birthDate) return undefined;
            const m = birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (!m) return undefined;
            const [, dd, mm, yyyy] = m;
            const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
            return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
        })();
        const payload = {
            email,
            password,
            phoneNumber: combinedPhone,
            firstName,
            lastName,
            role,
            countryId: selectedCountryId || undefined,
            cityId: selectedCityId || undefined,
            stateId: selectedStateId || undefined,
            birthDate: isoBirthDate
        };
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/user/register', payload);
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('jti', res.data.RefreshJTI);
            localStorage.setItem('user', res.data.firstName + ' ' + res.data.lastName);
            router.push('/');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed');
            }
        }
    };
    // Investor flow: submit directly (confirm inline on the form)
    const handleInvestorSubmitRequest = ()=>{
        handleUserRegister();
    };
    // Generate a UUID for related records
    const genId = ()=>typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : "".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
    // Handle Agency register + related record creation using dedicated services
    const handleAgencyRegister = async (data)=>{
        try {
            var _data_payload, _data_payload1;
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/agency/register', data.payload);
            // Show prompt only for successful 2xx responses
            if (res.status >= 200 && res.status < 300) {
                setShowAgencyPrompt(true);
            }
            // Persist tokens
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            if (res.data.RefreshJTI) localStorage.setItem('jti', res.data.RefreshJTI);
            if (((_data_payload = data.payload) === null || _data_payload === void 0 ? void 0 : _data_payload.firstName) && ((_data_payload1 = data.payload) === null || _data_payload1 === void 0 ? void 0 : _data_payload1.lastName)) {
                localStorage.setItem('user', "".concat(data.payload.firstName, " ").concat(data.payload.lastName));
            }
            // Extract agencyId from access token (sub)
            const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jwtDecode"])(res.data.accessToken);
            const agencyId = (decoded === null || decoded === void 0 ? void 0 : decoded.sub) || '';
            // Fire related creations in parallel (best-effort)
            const pmReqs = (data.related.primaryMarkets || []).map((p)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/agency/primary-market/create', {
                    id: genId(),
                    agencyId,
                    primaryMarket: p
                }));
            const spReqs = (data.related.servicesProvided || []).map((s)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/agency/service-provided/create', {
                    id: genId(),
                    agencyId,
                    serviceProvided: s
                }));
            const apiReqs = (data.related.additionalPartnershipInterests || []).map((a)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/agency/additional-partnership-interest/create', {
                    id: genId(),
                    agencyId,
                    additionalPartnershipInterest: a
                }));
            // Fire and forget; no need to block prompt
            Promise.allSettled([
                ...pmReqs,
                ...spReqs,
                ...apiReqs
            ]).catch(()=>{});
        } catch (e) {
            if (e instanceof Error) setError(e.message);
            else setError('Agency registration failed');
        }
    };
    // Agency flow: submit directly (confirm inline on the form)
    const handleAgencySubmitRequest = (data)=>{
        handleAgencyRegister(data);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            height: {
                xs: 'auto',
                md: '100vh'
            },
            overflow: {
                xs: 'visible',
                md: 'hidden'
            },
            bgcolor: '#fff'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    display: {
                        xs: 'block',
                        md: 'none'
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                flexShrink: 0
                            },
                            children: isAgencyRegister ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$chooseInvestor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onSelect: onSelectInvestorMobile,
                                onPreSelect: onPreSelectMobile,
                                buttonOnly: true,
                                buttonLabel: "Sign up as Investor",
                                paddingTop: 72,
                                paddingBottom: 72
                            }, void 0, false, {
                                fileName: "[project]/app/(pages)/register/page.tsx",
                                lineNumber: 293,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$chooseAgency$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onSelect: onSelectAgencyMobile,
                                onPreSelect: onPreSelectMobile,
                                buttonOnly: true,
                                buttonLabel: "Sign up as Agency",
                                paddingTop: 72,
                                paddingBottom: 72
                            }, void 0, false, {
                                fileName: "[project]/app/(pages)/register/page.tsx",
                                lineNumber: 302,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(pages)/register/page.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                mt: 6,
                                opacity: mobileFormOpacity,
                                transition: 'opacity 350ms ease'
                            },
                            children: isAgencyRegister ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$signUpAsAgency$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                countries: countries,
                                states: states,
                                cities: cities,
                                selectedCountryId: selectedCountryId,
                                selectedStateId: selectedStateId,
                                selectedCityId: selectedCityId,
                                setSelectedCountryById: setSelectedCountryId,
                                setSelectedStateById: setSelectedStateId,
                                setSelectedCityById: setSelectedCityId,
                                email: email,
                                setEmail: setEmail,
                                password: password,
                                setPassword: setPassword,
                                firstName: firstName,
                                setFirstName: setFirstName,
                                lastName: lastName,
                                setLastName: setLastName,
                                phonePrefix: phonePrefix,
                                setPhonePrefix: setPhonePrefix,
                                phoneNumber: phoneNumber,
                                setPhoneNumber: setPhoneNumber,
                                onSubmit: handleAgencySubmitRequest
                            }, void 0, false, {
                                fileName: "[project]/app/(pages)/register/page.tsx",
                                lineNumber: 314,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$signUpAsInvestor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                countries: countries,
                                states: states,
                                cities: cities,
                                selectedCountryId: selectedCountryId,
                                selectedStateId: selectedStateId,
                                selectedCityId: selectedCityId,
                                setSelectedCountryById: setSelectedCountryId,
                                setSelectedStateById: setSelectedStateId,
                                setSelectedCityById: setSelectedCityId,
                                email: email,
                                setEmail: setEmail,
                                password: password,
                                setPassword: setPassword,
                                firstName: firstName,
                                setFirstName: setFirstName,
                                lastName: lastName,
                                setLastName: setLastName,
                                phonePrefix: phonePrefix,
                                setPhonePrefix: setPhonePrefix,
                                phoneNumber: phoneNumber,
                                setPhoneNumber: setPhoneNumber,
                                birthDate: birthDate,
                                setBirthDate: setBirthDate,
                                onSubmit: handleInvestorSubmitRequest
                            }, void 0, false, {
                                fileName: "[project]/app/(pages)/register/page.tsx",
                                lineNumber: 339,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(pages)/register/page.tsx",
                            lineNumber: 312,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(pages)/register/page.tsx",
                    lineNumber: 290,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(pages)/register/page.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    display: {
                        xs: 'none',
                        md: 'block'
                    },
                    height: '100%',
                    overflow: 'hidden'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    sx: {
                        display: 'flex',
                        width: '200vw',
                        height: '100%',
                        transform: "translate3d(".concat(isAgencyRegister ? '-100vw' : '0', ", 0, 0)"),
                        transition: isResizing ? 'none' : 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'transform'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                display: 'flex',
                                width: '100vw',
                                height: '100%'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        width: '50vw',
                                        height: '100%',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$chooseAgency$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onSelect: ()=>setIsAgencyRegister(true)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(pages)/register/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(pages)/register/page.tsx",
                                    lineNumber: 384,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        width: '50vw',
                                        height: '100%',
                                        bgcolor: '#ffffff',
                                        p: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$signUpAsInvestor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        countries: countries,
                                        states: states,
                                        cities: cities,
                                        selectedCountryId: selectedCountryId,
                                        selectedStateId: selectedStateId,
                                        selectedCityId: selectedCityId,
                                        setSelectedCountryById: setSelectedCountryId,
                                        setSelectedStateById: setSelectedStateId,
                                        setSelectedCityById: setSelectedCityId,
                                        email: email,
                                        setEmail: setEmail,
                                        password: password,
                                        setPassword: setPassword,
                                        firstName: firstName,
                                        setFirstName: setFirstName,
                                        lastName: lastName,
                                        setLastName: setLastName,
                                        phonePrefix: phonePrefix,
                                        setPhonePrefix: setPhonePrefix,
                                        phoneNumber: phoneNumber,
                                        setPhoneNumber: setPhoneNumber,
                                        birthDate: birthDate,
                                        setBirthDate: setBirthDate,
                                        onSubmit: handleInvestorSubmitRequest
                                    }, void 0, false, {
                                        fileName: "[project]/app/(pages)/register/page.tsx",
                                        lineNumber: 398,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(pages)/register/page.tsx",
                                    lineNumber: 387,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(pages)/register/page.tsx",
                            lineNumber: 383,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                display: 'flex',
                                width: '100vw',
                                height: '100%'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        width: '50vw',
                                        height: '100%',
                                        bgcolor: '#ffffff',
                                        p: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$signUpAsAgency$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        countries: countries,
                                        states: states,
                                        cities: cities,
                                        selectedCountryId: selectedCountryId,
                                        selectedStateId: selectedStateId,
                                        selectedCityId: selectedCityId,
                                        setSelectedCountryById: setSelectedCountryId,
                                        setSelectedStateById: setSelectedStateId,
                                        setSelectedCityById: setSelectedCityId,
                                        email: email,
                                        setEmail: setEmail,
                                        password: password,
                                        setPassword: setPassword,
                                        firstName: firstName,
                                        setFirstName: setFirstName,
                                        lastName: lastName,
                                        setLastName: setLastName,
                                        phonePrefix: phonePrefix,
                                        setPhonePrefix: setPhonePrefix,
                                        phoneNumber: phoneNumber,
                                        setPhoneNumber: setPhoneNumber,
                                        onSubmit: handleAgencySubmitRequest
                                    }, void 0, false, {
                                        fileName: "[project]/app/(pages)/register/page.tsx",
                                        lineNumber: 440,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(pages)/register/page.tsx",
                                    lineNumber: 429,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        width: '50vw',
                                        height: '100%',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$register$2f$chooseInvestor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onSelect: ()=>setIsAgencyRegister(false)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(pages)/register/page.tsx",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(pages)/register/page.tsx",
                                    lineNumber: 465,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(pages)/register/page.tsx",
                            lineNumber: 428,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(pages)/register/page.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(pages)/register/page.tsx",
                lineNumber: 371,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Dialog$2f$Dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: showAgencyPrompt,
                onClose: ()=>setShowAgencyPrompt(false),
                maxWidth: "xs",
                fullWidth: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogTitle$2f$DialogTitle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        children: "Complete your agency portfolio?"
                    }, void 0, false, {
                        fileName: "[project]/app/(pages)/register/page.tsx",
                        lineNumber: 473,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogContent$2f$DialogContent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "body2",
                            sx: {
                                mt: 1
                            },
                            children: "Your agency account was created successfully. Would you like to complete your portfolio now?"
                        }, void 0, false, {
                            fileName: "[project]/app/(pages)/register/page.tsx",
                            lineNumber: 475,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(pages)/register/page.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogActions$2f$DialogActions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onClick: ()=>{
                                    setShowAgencyPrompt(false);
                                    router.push('/');
                                },
                                children: "No, maybe later"
                            }, void 0, false, {
                                fileName: "[project]/app/(pages)/register/page.tsx",
                                lineNumber: 480,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "contained",
                                onClick: ()=>{
                                    setShowAgencyPrompt(false);
                                    router.push('/agencyDashboard');
                                },
                                children: "Yes, take me there"
                            }, void 0, false, {
                                fileName: "[project]/app/(pages)/register/page.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(pages)/register/page.tsx",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(pages)/register/page.tsx",
                lineNumber: 472,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(pages)/register/page.tsx",
        lineNumber: 281,
        columnNumber: 5
    }, this);
}
_s(RegisterPage, "itySZOiWchBn3VkzxEjs35vBN3g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = RegisterPage;
var _c;
__turbopack_context__.k.register(_c, "RegisterPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_24de7a4a._.js.map