import { t as __exportAll } from "./compiler_CBu450M1.mjs";
import { C as createComponent, S as createAstro, _ as addAttribute, a as renderComponent, c as renderSlot, d as renderTemplate, g as renderHead, h as maybeRenderHead, n as renderScript } from "./server_CM2-jHE_.mjs";
//#region node_modules/astro/components/ClientRouter.astro
createAstro("https://www.infolavelada.com/");
var $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ClientRouter;
	const { fallback = "animate" } = Astro.props;
	return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/node_modules/astro/components/ClientRouter.astro", void 0);
//#endregion
//#region node_modules/@vercel/analytics/dist/astro/index.astro
createAstro("https://www.infolavelada.com/");
var $$Index$1 = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index$1;
	return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", {
		"data-props": JSON.stringify(Astro.props),
		"data-params": JSON.stringify(Astro.params),
		"data-pathname": Astro.url.pathname
	})}${renderScript($$result, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);
//#endregion
//#region src/sections/Header.astro
var $$Header = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<header>Header</header>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Header.astro", void 0);
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://www.infolavelada.com/");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const DEFAULT_OG_IMAGE = `https://cdn.vmv-arquitectos.com/og.jpg`;
	const DEFAULT_OG_ALT = "VMV Arquitectos — Diseño y Construcción de Espacios Funcionales y Estéticos";
	const { title, description = "VMV Arquitectos - Diseño y Construcción de Espacios Funcionales y Estéticos", canonical, robots, ogImage = DEFAULT_OG_IMAGE, ogImageAlt = DEFAULT_OG_ALT, ogUrl, ogType = "website", showHeader = true } = Astro.props;
	const cleanPathname = Astro.url.pathname === "/" ? "/" : Astro.url.pathname.replace(/\/$/, "");
	canonical ?? `${cleanPathname}`;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>
      VMV Arquitectos - Diseño y Construcción de Espacios Funcionales y Estéticos
    </title><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><meta name="description" content="VMV Arquitectos - Diseño y Construcción de Espacios Funcionales y Estéticos"><meta name="author" content="VMV Arquitectos"><link rel="canonical" href="https://www.vmv-arquitectos.com/"><meta name="robots" content="index, follow">${renderSlot($$result, $$slots["head"])}${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}${renderComponent($$result, "Analytics", $$Index$1, {})}${renderHead($$result)}</head><body>${showHeader && renderTemplate`${renderComponent($$result, "Header", $$Header, {})}`}<main id="main-content">${renderSlot($$result, $$slots["default"])}</main></body></html>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/layouts/Layout.astro", void 0);
//#endregion
//#region src/sections/Alcance.astro
var $$Alcance = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section>Alcance</section>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Alcance.astro", void 0);
//#endregion
//#region src/sections/Contacto.astro
var $$Contacto = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section>Contacto</section>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Contacto.astro", void 0);
//#endregion
//#region src/sections/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section>Footer</section>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Footer.astro", void 0);
//#endregion
//#region src/sections/Galeria.astro
var $$Galeria = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section>Galería</section>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Galeria.astro", void 0);
//#endregion
//#region src/sections/Hero.astro
var $$Hero = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="h-screen flex items-center justify-center bg-gray-100">Hero</section>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Hero.astro", void 0);
//#endregion
//#region src/sections/Nosotros.astro
var $$Nosotros = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section>Nosotros</section>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Nosotros.astro", void 0);
//#endregion
//#region src/sections/Proceso.astro
var $$Proceso = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section>Proceso</section>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Proceso.astro", void 0);
//#endregion
//#region src/sections/Servicios.astro
var $$Servicios = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section>Servicios</section>`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/sections/Servicios.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "VMV Arquitectos - Diseño y Construcción de Espacios Funcionales y Estéticos",
		"description": "VMV Arquitectos - Diseño y Construcción de Espacios Funcionales y Estéticos",
		"canonical": `https://www.vmv-arquitectos.com/`
	}, { "default": ($$result) => renderTemplate`
	${renderComponent($$result, "Hero", $$Hero, {})}
  ${renderComponent($$result, "Nosotros", $$Nosotros, {})}
  ${renderComponent($$result, "Galeria", $$Galeria, {})}
  ${renderComponent($$result, "Servicios", $$Servicios, {})}
  ${renderComponent($$result, "Alcance", $$Alcance, {})}
  ${renderComponent($$result, "Proceso", $$Proceso, {})}
  ${renderComponent($$result, "Contacto", $$Contacto, {})}
  ${renderComponent($$result, "Footer", $$Footer, {})}
` })}`;
}, "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/pages/index.astro", void 0);
var $$file = "C:/Users/PC/Desktop/Emanuel/vmv-arquitectos/vmv-arq/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
