
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.22.3 */

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div4;
    	let header;
    	let div1;
    	let div0;
    	let h3;
    	let t1;
    	let nav;
    	let a0;
    	let t3;
    	let a1;
    	let i0;
    	let t4;
    	let li;
    	let a2;
    	let i1;
    	let t5;
    	let main;
    	let div2;
    	let img;
    	let img_src_value;
    	let t6;
    	let h1;
    	let t7;
    	let t8;
    	let t9;
    	let p0;
    	let t10;
    	let a3;
    	let t12;
    	let t13;
    	let a4;
    	let t15;
    	let footer;
    	let div3;
    	let p1;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			header = element("header");
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "T.R.D.C.";
    			t1 = space();
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t3 = space();
    			a1 = element("a");
    			i0 = element("i");
    			t4 = space();
    			li = element("li");
    			a2 = element("a");
    			i1 = element("i");
    			t5 = space();
    			main = element("main");
    			div2 = element("div");
    			img = element("img");
    			t6 = space();
    			h1 = element("h1");
    			t7 = text("🦕 ");
    			t8 = text(/*name*/ ctx[0]);
    			t9 = space();
    			p0 = element("p");
    			t10 = text("Now running on Deno and Svelte. Check out the code\r\n        ");
    			a3 = element("a");
    			a3.textContent = "here";
    			t12 = text(".");
    			t13 = space();
    			a4 = element("a");
    			a4.textContent = "Download Resume";
    			t15 = space();
    			footer = element("footer");
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "Copyright 2020 Ted Rand, all rights reserved.";
    			add_location(h3, file, 8, 8, 217);
    			attr_dev(div0, "class", "masthead-brand svelte-5vyxs");
    			add_location(div0, file, 7, 6, 179);
    			attr_dev(a0, "class", "nav-link active svelte-5vyxs");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file, 11, 8, 319);
    			attr_dev(i0, "class", "fab fa-github");
    			add_location(i0, file, 13, 10, 455);
    			attr_dev(a1, "href", "https://github.com/tedrand");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "nav-link svelte-5vyxs");
    			add_location(a1, file, 12, 8, 373);
    			attr_dev(i1, "class", "fab fa-linkedin-in");
    			add_location(i1, file, 20, 12, 680);
    			attr_dev(a2, "href", "https://www.linkedin.com/in/tedrand/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "nav-link svelte-5vyxs");
    			add_location(a2, file, 16, 10, 547);
    			attr_dev(li, "class", "nav-item fa-icon");
    			add_location(li, file, 15, 8, 506);
    			attr_dev(nav, "class", "nav nav-masthead justify-content-center svelte-5vyxs");
    			add_location(nav, file, 10, 6, 256);
    			attr_dev(div1, "class", "inner");
    			add_location(div1, file, 6, 4, 152);
    			attr_dev(header, "class", "masthead mb-auto svelte-5vyxs");
    			add_location(header, file, 5, 2, 113);
    			attr_dev(img, "class", "thumbnail svelte-5vyxs");
    			if (img.src !== (img_src_value = "/public/cover-image.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file, 29, 6, 875);
    			add_location(h1, file, 30, 6, 945);
    			attr_dev(a3, "class", "body-link");
    			attr_dev(a3, "href", "https://github.com/tedrand/tr-deno");
    			add_location(a3, file, 33, 8, 1044);
    			add_location(p0, file, 31, 6, 971);
    			attr_dev(a4, "href", "public/Theodore_Rand_Resume.pdf");
    			attr_dev(a4, "class", "btn btn-lg btn-dark svelte-5vyxs");
    			attr_dev(a4, "target", "_blank");
    			set_style(a4, "background-color", "#2abe96");
    			add_location(a4, file, 35, 6, 1136);
    			attr_dev(div2, "class", "container text-center");
    			add_location(div2, file, 28, 4, 832);
    			attr_dev(main, "role", "main");
    			attr_dev(main, "class", "inner cover svelte-5vyxs");
    			add_location(main, file, 27, 2, 788);
    			add_location(p1, file, 46, 6, 1416);
    			attr_dev(div3, "class", "inner");
    			add_location(div3, file, 45, 4, 1389);
    			attr_dev(footer, "class", "mastfoot mt-auto svelte-5vyxs");
    			add_location(footer, file, 44, 2, 1350);
    			attr_dev(div4, "class", "cover-container d-flex h-100 p-3 mx-auto flex-column svelte-5vyxs");
    			add_location(div4, file, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, header);
    			append_dev(header, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(div1, t1);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t3);
    			append_dev(nav, a1);
    			append_dev(a1, i0);
    			append_dev(nav, t4);
    			append_dev(nav, li);
    			append_dev(li, a2);
    			append_dev(a2, i1);
    			append_dev(div4, t5);
    			append_dev(div4, main);
    			append_dev(main, div2);
    			append_dev(div2, img);
    			append_dev(div2, t6);
    			append_dev(div2, h1);
    			append_dev(h1, t7);
    			append_dev(h1, t8);
    			append_dev(div2, t9);
    			append_dev(div2, p0);
    			append_dev(p0, t10);
    			append_dev(p0, a3);
    			append_dev(p0, t12);
    			append_dev(div2, t13);
    			append_dev(div2, a4);
    			append_dev(div4, t15);
    			append_dev(div4, footer);
    			append_dev(footer, div3);
    			append_dev(div3, p1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t8, /*name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { name } = $$props;
    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Patent Agent | Law Student'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
