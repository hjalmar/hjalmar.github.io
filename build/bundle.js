
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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
            set_current_component(null);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
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
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.0' }, detail)));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    const prepare = (base, route) => {
      // prefix the base to always start with a '/' and remove trailing slash
      base = '/'+base.replace(/^[\/]+|[\/]+$/g, '');
      // strip multiple occurences of '/'
      route = (`${base}/${route}`).replace(/[\/]+/g, '/');
      // remove leading and trailing slashes
      route = route.replace(/^[\/]+|[\/]+$/g, '');
      // get if it's explicit or not. could be a factor when determining route based on it's size/weight 
      // in terms of what has presedent when two routes would've matched the same url
      const explicit = /\*$/.test(route);
      // if it's implicit or explicit
      const lazy = explicit ? (route = route.replace(/[\*]+$/g, ''), ''): '/?$';
      // store parameters
      const parameters = [];
      let index = 0;
      let regexpRoute = route.replace(/(:)?([^\\/]+)/g, (parameter, colonParameter, identifier) => {
        const [ param, boundValue ] = identifier.split('->');
        if(colonParameter){
          // check for duplicates
          const duplicates = parameters.filter(old => old.identifier == boundValue); 
          if(duplicates.length > 0){
            throw new Error(`Duplicated parameter. [${duplicates.map(_=>_.identifier)}]`);
          }
          // store parameter reference
          parameters.push({
            index: index++,
            parameter,
            identifier: param,
          });
          // bound parameter
          return boundValue ? `(${boundValue})` : `([^\/]+)`;
        }
        return `${parameter}`;
      });
      regexpRoute = `^/${regexpRoute}${lazy}`;
      return {
        base,
        route,
        regexpRoute,
        parameters,
      }
    };

    class Route{
      constructor(base, route, fn, middlewares = []){
        Object.assign(this, prepare(base, route));
        this.callback = fn;
        this.middlewares = middlewares;
      }
    }

    class Middleware{
      constructor(...props){
        this.props = props;
      }
      use(fn){
        if(typeof fn != 'function'){
          throw new Error(`Invalid Middleware use argument. Expecting 'function' got : '${typeof fn}'`); 
        }
        const f = (stack) => next => stack(fn.bind(this, ...this.props, next));
        this.execute = f(this.execute);
        return this;
      }
      execute(fn){
        return fn.call(null);
      }
    }

    class Request{
      constructor(props){
        Object.assign(this, {
          base: '',
          path: '',
          route: '',
          params: {}
        }, props);
      }
    }

    class Response{
      constructor(fn){
        if(typeof fn != 'function'){
          throw new Error(`Invalid response callback. Expecting 'function'`);
        }
        this.send = fn;
      }
    }

    // router
    class Router{
      constructor(props){
        // store properties and freeze them so not to be able to get modified
        Object.freeze(this.__properties = {
          initial: undefined,
          base: '',
          ...props
        });
        // are we subscribing?
        this.__subscribing = false;
        // store
        this.__get = new Map();
        this.__catch = new Map();
        this.__use = new Set();
      }
      _register(routes, fn, middlewares, list){
        routes.map(route => {
          const r = new Route(this.__properties.base, route, fn, middlewares);
          if(list.has(r.regexpRoute)){
            throw new Error(`Route with same endpoint already exist. [${route}, /${list.get(r.regexpRoute).route}](${r.regexpRoute})`);
          }
          list.set(r.regexpRoute, r);
        });
        return routes;
      }
      _props(...args){
        let routes, fn, middlewares = [];
        if(args.length == 1){
          [ fn ] = args;
          routes = '*';
        }else if(args.length == 2){
          [ routes, fn ] = args;
        }else if(args.length > 2){
          routes = args.shift();
          fn = args.pop();
          middlewares = args;      
        }else {
          throw new Error(`Invalid number prop arguments.`);
        }
        routes = Array.isArray(routes) ? routes : [routes];
        return { routes, fn, middlewares };
      }
      _storeInList(fnName, list, ...args){
        const { routes, fn, middlewares } = this._props(...args);
        const parentRoutes = this._register(routes, fn, middlewares, list);
        // enable chaining to group sub routes to a main route
        // not needed since the routes are store as unique strings in the end 
        // but might be a nicer way to organize the implementation
        const ret = {
          [fnName]: (...innerArgs) => {
            const { routes: innerRoutes, fn: innerFn, middlewares: innerMiddlewares } = this._props(...innerArgs);
            parentRoutes.map(route => innerRoutes.map(_ => route + _).map(_ => this[fnName](_, ...[...innerMiddlewares, innerFn])));
            return ret;
          }
        };
        return ret;
      }
      get(...args){
        return this._storeInList('get', this.__get, ...args);
      }
      use(...args){
        const { routes, fn } = this._props(args);
        routes.map(url => this.__use.add(new Route(this.__properties.base, url, ...fn)));
      }
      catch(...args){
        return this._storeInList('catch', this.__catch, ...args);
      }
      _findRoute(url, list){
        for(let [ regexpRoute, RouteInstance ] of list){
          const parameters = url.match(new RegExp(regexpRoute, 'i'));
          if(parameters){
            const uri = parameters.shift();
            // update Route with new parameters
            let params = {};
            if(parameters.length > 0){
              // create a parameters object
              params = RouteInstance.parameters.reduce((obj, value, index) => {
                obj[value.identifier] = parameters[index];
                return obj;
              }, params);
            }

            // update request object
            const returnObject = { 
              RouteInstance,
              Request: new Request({
                path: url,
                route: '/' + RouteInstance.route,
                base: RouteInstance.base,
                params: params
              })
            };
            return returnObject;
          }
        }
      }
      execute(url){
        if(typeof url != 'string'){
          throw new Error(`Invalid 'execute' argument. Expecting 'string'`);
        }
        if(!this.__subscribing){
          return;
        }
        const response = new Response((...props) => this.__router_callback.call(null, ...props));
        let matchFound = this._findRoute(url, this.__get);
        if(!matchFound){
          const errorsFound = this._findRoute(url, this.__catch, true);
          if(!errorsFound){
            console.warn(`No route or catch fallbacks found for [${url}]`);
            return;
          }
          errorsFound.RouteInstance.callback.call(null, errorsFound.Request, response);
          return;
        }
        let middlewares = [];
        const middleware = new Middleware(matchFound.Request, response);
        this.__use.forEach(middlewareRoute => {
          const RouteInstance = url.match(new RegExp(middlewareRoute.regexpRoute, 'i'));
          if(RouteInstance){
            middlewares.push(middlewareRoute.callback);
          }
        });
        middlewares = [...middlewares, ...matchFound.RouteInstance.middlewares, matchFound.RouteInstance.callback];
        middlewares.map(fn => middleware.use(fn));
        // execute middleware
        middleware.execute();
      }
      subscribe(fn){
        this.__subscribing = true;
        if(typeof fn == 'function'){
          this.__router_callback = fn;
        }
        if(this.__properties.initial){
          this.execute(this.__properties.initial);
        }
        return () => {
          this.__subscribing = false;
        }
      }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let contexts = new Map();
    let location$1 = writable();
    let initialized = false;

    if(!initialized){
      initialized = true;
      location$1.set(window.location.pathname);
      window.addEventListener('popstate', e => {
        location$1.set(window.location.pathname);
        contexts.forEach(context => context.router.execute(window.location.pathname));
      });
    }

    var router = (options) => {
      const router = new Router(options);
      contexts.set(router, {
        component: writable(),
        router
      });
      return router;
    };

    /* node_modules\svelte-standalone-router\router.svelte generated by Svelte v3.29.0 */

    const { Error: Error_1 } = globals;

    const get_default_slot_changes = dirty => ({
    	component: dirty & /*$component*/ 1,
    	props: dirty & /*$component*/ 1
    });

    const get_default_slot_context = ctx => ({
    	component: /*$component*/ ctx[0].context,
    	props: /*$component*/ ctx[0].props
    });

    // (21:0) {#if $component}
    function create_if_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, $component*/ 17) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*$component*/ 1) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(21:0) {#if $component}",
    		ctx
    	});

    	return block;
    }

    // (22:64)       
    function fallback_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*$component*/ ctx[0].props];
    	var switch_value = /*$component*/ ctx[0].context;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$component*/ 1)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*$component*/ ctx[0].props)])
    			: {};

    			if (switch_value !== (switch_value = /*$component*/ ctx[0].context)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(22:64)       ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$component*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$component*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$component*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $component;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { context = contexts.keys().next().value } = $$props;

    	if (!context || !(context instanceof Router)) {
    		throw new Error(`Invalid Router context. Did you initialize the component with a valid context?`);
    	}

    	const { component } = contexts.get(context);
    	validate_store(component, "component");
    	component_subscribe($$self, component, value => $$invalidate(0, $component = value));

    	const unsubscribe = context.subscribe((callback, props = {}) => {
    		component.set({
    			context: class extends callback {
    				
    			},
    			props
    		});
    	});

    	const writable_props = ["context"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("context" in $$props) $$invalidate(2, context = $$props.context);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		contexts,
    		context,
    		component,
    		unsubscribe,
    		$component
    	});

    	$$self.$inject_state = $$props => {
    		if ("context" in $$props) $$invalidate(2, context = $$props.context);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$component, component, context, unsubscribe, $$scope, slots];
    }

    class Router_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { context: 2, unsubscribe: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router_1",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get context() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unsubscribe() {
    		return this.$$.ctx[3];
    	}

    	set unsubscribe(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var link = (element, props) => {
      const clickHandler = (e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if(!href){
          return;
        }
        history.pushState(null, '', href);
        dispatchEvent(new Event('popstate'));
      };
      element.addEventListener('click', clickHandler);
      return {
        update(parameters){},
        destroy(){element.removeEventListener('click', clickHandler);}
      }
    };

    /* src\components\github-icon.svelte generated by Svelte v3.29.0 */

    const file = "src\\components\\github-icon.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z");
    			add_location(path, file, 1, 2, 87);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "40");
    			attr_dev(svg, "height", "40");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "class", "svelte-1is6w2v");
    			add_location(svg, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Github_icon", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Github_icon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Github_icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Github_icon",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\components\switch.svelte generated by Svelte v3.29.0 */

    const { console: console_1 } = globals;
    const file$1 = "src\\components\\switch.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let input;
    	let t;
    	let label;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			label = element("label");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "onoffswitch");
    			attr_dev(input, "class", "onoffswitch-checkbox svelte-tp9z9b");
    			attr_dev(input, "id", "myonoffswitch");
    			attr_dev(input, "tabindex", "0");
    			input.checked = /*checked*/ ctx[1];
    			add_location(input, file$1, 8, 2, 158);
    			attr_dev(label, "class", "onoffswitch-label svelte-tp9z9b");
    			attr_dev(label, "for", "myonoffswitch");
    			add_location(label, file$1, 9, 2, 302);
    			attr_dev(div, "class", "onoffswitch svelte-tp9z9b");
    			add_location(div, file$1, 7, 0, 129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, t);
    			append_dev(div, label);

    			if (!mounted) {
    				dispose = listen_dev(
    					input,
    					"change",
    					function () {
    						if (is_function(/*change*/ ctx[0])) /*change*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*checked*/ 2) {
    				prop_dev(input, "checked", /*checked*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Switch", slots, []);

    	let { change = e => {
    		console.log("Not implemented");
    	} } = $$props;

    	let { checked = false } = $$props;
    	const writable_props = ["change", "checked"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Switch> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("change" in $$props) $$invalidate(0, change = $$props.change);
    		if ("checked" in $$props) $$invalidate(1, checked = $$props.checked);
    	};

    	$$self.$capture_state = () => ({ change, checked });

    	$$self.$inject_state = $$props => {
    		if ("change" in $$props) $$invalidate(0, change = $$props.change);
    		if ("checked" in $$props) $$invalidate(1, checked = $$props.checked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [change, checked];
    }

    class Switch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { change: 0, checked: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switch",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get change() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set change(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var top = "Till toppen";
    var header = {
    	heading: "Jens Hjalmarsson",
    	slogan: "Webdeveloper, Webdesigner, Programmer and more",
    	github: {
    		label: "Visit my github",
    		slug: "https://github.com/hjalmar"
    	},
    	navigation: [
    		{
    			label: "arbeten",
    			slug: "/"
    		},
    		{
    			label: "labbet",
    			slug: "/lab"
    		},
    		{
    			label: "om mig",
    			slug: "/about"
    		},
    		{
    			label: "kontakt",
    			slug: "/contact"
    		}
    	]
    };
    var lab = {
    	intro: [
    		"I love prototyping, infact I like it more than the end result of a product. Here I've collected my <em>personal</em> projects and work that doesn't fit under the <em>work</em> category."
    	],
    	items: [
    		{
    			previews: [
    			],
    			title: "NESBit Studio",
    			description: "A from the ground up game engine and tools for developing Nintendo Entertainment System games and assets. <em>Online preview coming soon!</em>",
    			year: 2020,
    			tags: [
    				"HTML",
    				"CSS",
    				"Javascript",
    				"Svelte",
    				"Node",
    				"Electron",
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "iframe",
    					src: "index.html"
    				}
    			],
    			title: "Typist",
    			description: "description",
    			year: 2020,
    			tags: [
    				"HTML",
    				"CSS",
    				"Javascript",
    				"Svelte"
    			]
    		}
    	]
    };
    var work = {
    	intro: [
    		"Here I’ve collected some recent work related to <em>web</em>, <em>design</em>, <em>programming</em> and <em>game development</em>.<br>Feel free to contact me regarding any of my <em>work</em>, <em>packages</em> or <em>oddjobs</em> you may have. :)"
    	],
    	items: [
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/svelte_society.png"
    				}
    			],
    			title: "Svelte Society",
    			description: "Light design based on svelte’s brand. Svelte society is a community driven site bringing people together around the open source frontend framework svelte.",
    			year: 2020,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/consulting.png"
    				}
    			],
    			title: "Consulting",
    			description: "Light design based on svelte’s brand. Svelte society is a community driven site bringing people together around the open source frontend framework svelte.",
    			year: 2018,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/maidforyou.png"
    				}
    			],
    			title: "Maid For You",
    			description: "Light design based on svelte’s brand. Svelte society is a community driven site bringing people together around the open source frontend framework svelte.",
    			year: 2018,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/ms-paper-preview.png"
    				}
    			],
    			title: "Memosten",
    			description: "Branding, landing page and dashboard concept for this opensource alternative for server analytics.",
    			year: 2019,
    			tags: [
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/hemanglarna.png"
    				}
    			],
    			title: "Hemänglarna",
    			description: "Light design based on svelte’s brand. Svelte society is a community driven site bringing people together around the open source frontend framework svelte.",
    			year: 2017,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/ya-dashboard.png"
    				},
    				{
    					type: "image",
    					src: "/assets/work/design/ya.png"
    				}
    			],
    			title: "YourAnalytics",
    			description: "<em>Branding</em>, <em>landing page</em> and <em>dashboard</em> concept for this opensource alternative for server analytics.",
    			year: 2020,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/theraessentials.png"
    				}
    			],
    			title: "TheraVape",
    			description: "Branding, landing page and dashboard concept for this opensource alternative for server analytics.",
    			year: 2018,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/bohuscup.png"
    				}
    			],
    			title: "Bohuscup",
    			description: "Branding, landing page and dashboard concept for this opensource alternative for server analytics.",
    			year: 2020,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/jh.png"
    				}
    			],
    			title: "Jens Hjalmarsson",
    			description: "My personal brand. Two <em>J's</em> that together form the letter <em>H</em> which are the first letters of my name",
    			year: 2019,
    			tags: [
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/at_skogsservice.png"
    				}
    			],
    			title: "At Skogsservice AB",
    			description: "Branding concept for this forest cutting company. The letter <em>A</em> in the negative space and a lowercase <em>t</em> as a tree in the positive space.",
    			year: 2018,
    			tags: [
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/govinsight.png"
    				}
    			],
    			title: "GOVINSIGHT",
    			description: "Whats more American than an American start? Probably a lot. But in this concept the star represents the government being <em>'insight'</em>",
    			year: 2018,
    			tags: [
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/arkexpedited.png"
    				}
    			],
    			title: "ARK Expedited",
    			description: "Branding concept for this forest cutting company. The letter <em>A</em> in the negative space and a lowercase <em>t</em> as a tree in the positive space.",
    			year: 2018,
    			tags: [
    				"Illustrator"
    			]
    		}
    	]
    };
    var about = {
    	intro: [
    		"Hi! I'm Jens Hjalmarsson. A <em>webdeveloper</em>, <em>webdesigner</em>, <em>programmer</em> from Sweden. I've been making websites for about 20 years."
    	]
    };
    var se = {
    	top: top,
    	header: header,
    	lab: lab,
    	work: work,
    	about: about
    };

    var top$1 = "Go back top";
    var header$1 = {
    	heading: "Jens Hjalmarsson",
    	slogan: "Webdeveloper, Webdesigner, Programmer and more",
    	github: {
    		label: "Visit my github",
    		slug: "https://github.com/hjalmar"
    	},
    	navigation: [
    		{
    			label: "my work",
    			slug: "/"
    		},
    		{
    			label: "lab",
    			slug: "/lab"
    		},
    		{
    			label: "about me",
    			slug: "/about"
    		},
    		{
    			label: "contact",
    			slug: "/contact"
    		}
    	]
    };
    var lab$1 = {
    	intro: [
    		"I love prototyping, infact I like it more than the end result of a product. Here I've collected my <em>personal</em> projects that doesn't fit under the <em>work</em> category."
    	],
    	items: [
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/projects/electron-boilerplate/electron-boilerplate.jpg"
    				}
    			],
    			title: "Electron Boilerplate",
    			description: "An extensively configured Svelte Electron boilerplate which out of the box comes with <em>Actions manager</em>, <em>Hotkeys manager</em>, <em>Routing</em> and more!",
    			year: 2020,
    			tags: [
    				"HTML",
    				"CSS",
    				"Javascript",
    				"Svelte",
    				"Node",
    				"Electron"
    			],
    			links: [
    				"https://github.com/hjalmar/svelte-electron-boilerplate"
    			]
    		}
    	]
    };
    var work$1 = {
    	intro: [
    		"Here I’ve collected some recent work related to <em>web</em>, <em>design</em> and <em>programming</em>. Feel free to contact me regarding any of my <em>work</em>, <em>packages</em> or <em>oddjobs</em> you may have."
    	],
    	items: [
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/svelte_society.jpg"
    				}
    			],
    			title: "Svelte Society",
    			description: "Light design based on svelte’s brand. Svelte society is a community driven site bringing people together around the open source frontend framework svelte.",
    			year: 2020,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/consulting.jpg"
    				}
    			],
    			title: "Consulting",
    			description: "Concept for a consulting firm whos aim is to help other consultants manage their business in a more efficient way.",
    			year: 2018,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/maidforyou.jpg"
    				}
    			],
    			title: "Maid For You",
    			description: "Keep your home nice and clean with this online booking service. Concept for website to hire your personal cleaning maid.",
    			year: 2018,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/bohuscup.jpg"
    				}
    			],
    			title: "Bohuscup",
    			description: "Concept for this sportscup's website platform which caters to kids in all age groups up until young adults",
    			year: 2020,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/memosten.png"
    				}
    			],
    			title: "Memosten",
    			description: "Memosten is a company specializing in fine engravings on rocks. Commemorate a loved one with fine engraved stone to keep close by.",
    			year: 2019,
    			tags: [
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/hemanglarna.jpg"
    				}
    			],
    			title: "Hemänglarna",
    			description: "A light and clean landing page concept for this on-demand cleanings service portal.",
    			year: 2017,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/ya-dashboard.jpg"
    				},
    				{
    					type: "image",
    					src: "/assets/work/design/ya.jpg"
    				}
    			],
    			title: "YourAnalytics",
    			description: "Branding, landing page and dashboard concept for this open source server analytics application.",
    			year: 2020,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/design/theraessentials.jpg"
    				}
    			],
    			title: "TheraVape",
    			description: "A minimalistic webstore catered to CBD and essential oil remedies where the product is the main focus.",
    			year: 2018,
    			tags: [
    				"Photoshop",
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/jh.jpg"
    				}
    			],
    			title: "Jens Hjalmarsson",
    			description: "My personal brand. Two J's that together form the letter H which are the first letters of my name.",
    			year: 2019,
    			tags: [
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/at_skogsservice.png"
    				}
    			],
    			title: "At Skogsservice AB",
    			description: "Branding concept for this forest cutting company. The letter A in the negative space and a lowercase t as a tree in the positive space.",
    			year: 2018,
    			tags: [
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/govinsight.png"
    				}
    			],
    			title: "GOVINSIGHT",
    			description: "Whats more American than an American star? Probably a lot. But in this concept the star represents the government being 'insight'",
    			year: 2017,
    			tags: [
    				"Illustrator"
    			]
    		},
    		{
    			previews: [
    				{
    					type: "image",
    					src: "/assets/work/branding/arkexpedited.png"
    				}
    			],
    			title: "ARK Expedited",
    			description: "A sharp and bold brand concept for this domestic trucking and shipping company.",
    			year: 2017,
    			tags: [
    				"Illustrator"
    			]
    		}
    	]
    };
    var about$1 = {
    	intro: [
    		"I'm <em>Jens Hjalmarsson</em>, a <em>webdeveloper</em>, <em>webdesigner</em> and <em>programmer</em> from <em>Sweden</em>. I first got in contact with webdevelopment in the <em>mid to late 90s</em> and has continued on ever since.",
    		"During these years I've accumulated knowledge from about any corner of the web. From things like <em>Photoshop</em>, <em>Illustrator</em>, <em>FL Studio</em>, <em>HTML</em>, <em>CSS</em>, <em>Javascript</em>, <em>PHP</em>, <em>Node</em>, <em>Svelte</em>, <em>React</em>, <em>jQuery</em>, <em>Express</em>, <em>MySQL</em>, <em>Firebase</em>, <em>NoSQL</em>, <em>MongoDB</em>, <em>Electron</em>, <em>Python</em>, <em>GDScript</em>, <em>nginx</em>, <em>Apache</em>, <em>Responsive design</em>, <em>PWA</em> and much more.",
    		"Currently I'm slowly transitioning my main webstack to consist of <em>Node</em>, <em>Svelte</em>, <em>HTML</em>, <em>CSS</em>, <em>Javascript</em> and <em>MySQL</em>.",
    		"Besides developing stuff, I've grown up playing in <em>bands</em> and being creative <em>making music</em>. These days I sometimes like to create melodic repetetive songs for my own enjoyment or use in various <em>personal projects</em>, which you can check out over at my <a href=\"https://soundcloud.com/senajmusic\">soundcloud page</a>.",
    		"Feel free to contact me if you want to discuss my work, packages or anything related to webdevelopment.",
    		"If you find any of my <em>open source</em> work beneficial to you and your work and like to support me. Any small amount for a coffee helping one stay up late at night would be highly appreciated. <a href=\"https://paypal.me/jenshjalmarsson\">paypal.me/jenshjalmarsson</a>",
    		"Just as appreciated is bug reporting and feature request on my github packages."
    	]
    };
    var contact = [
    	"The easiest way to come in contact with me is by <em>email</em>. You can reach me at <em>jens.hjalmarsson@gmail.com</em>"
    ];
    var en = {
    	top: top$1,
    	header: header$1,
    	lab: lab$1,
    	work: work$1,
    	about: about$1,
    	contact: contact
    };

    // themes 
    const theme = (() => {
      // const store = writable(localStorage.getItem('theme') || 'true');
      const store = writable(true);
      const { subscribe, update } = store;
      document.documentElement.dataset.theme = get_store_value(store) ? 'dark' : 'light';
      return {
        subscribe,
        toggle(){
          update((current) => {
            const val = !current;
            // localStorage.setItem('theme', !val);
            document.documentElement.dataset.theme = val ? 'dark' : 'light';
            return val;
            // return localStorage.getItem('theme');
          });
        }
      }
    })();


    // selected language
    const [country, code] = navigator.language.toLowerCase().split('-'); 

    // words
    const languageList = new Map([
      ['en', en],
      ['se', se]
    ]);

    const lang = writable(undefined);

    const setTranslation = (l) => {
      if(languageList.has(l)){
        lang.set(languageList.get(l));
      }
    };

    // debug with en only to start with
    setTranslation('en');

    let stopLoop;

    // intersections
    const intersections = (() => {
      const store = writable([]);
      const { subscribe, set, update } = store;
      return {
        subscribe,
        add: (entry) => {
          update(_ => {
            return [..._, entry];
          });
        },
        remove: (entry) => {
          update((_) => {
            const i = _.indexOf(entry);
            if(i){
              _.splice(i, 1);
              if(!_.length && stopLoop){
                stopLoop();
                stopLoop = undefined;
              }
            }
            return _;
          });
        }
      }
    })();

    /* src\components\navigation.svelte generated by Svelte v3.29.0 */

    const file$2 = "src\\components\\navigation.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (47:4) {#each $lang.header.navigation as item}
    function create_each_block(ctx) {
    	let a;
    	let t_value = /*item*/ ctx[9].label + "";
    	let t;
    	let a_href_value;
    	let link_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[9].slug);
    			toggle_class(a, "active", /*$location*/ ctx[4] == /*item*/ ctx[9].slug);
    			add_location(a, file$2, 47, 6, 1737);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link_action = link.call(null, a)),
    					listen_dev(a, "click", /*click_handler_1*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$lang*/ 8 && t_value !== (t_value = /*item*/ ctx[9].label + "")) set_data_dev(t, t_value);

    			if (dirty & /*$lang*/ 8 && a_href_value !== (a_href_value = /*item*/ ctx[9].slug)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$location, $lang*/ 24) {
    				toggle_class(a, "active", /*$location*/ ctx[4] == /*item*/ ctx[9].slug);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(47:4) {#each $lang.header.navigation as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let button0;
    	let svg0;
    	let path0;
    	let t0;
    	let nav_1;
    	let button1;
    	let svg1;
    	let path1;
    	let t1;
    	let switch_1;
    	let t2;
    	let div0;
    	let githubicon;
    	let t3;
    	let a;
    	let t4_value = /*$lang*/ ctx[3].header.github.label + "";
    	let t4;
    	let a_href_value;
    	let t5;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;

    	switch_1 = new Switch({
    			props: {
    				change: theme.toggle,
    				checked: /*$theme*/ ctx[2]
    			},
    			$$inline: true
    		});

    	githubicon = new Github_icon({ $$inline: true });
    	let each_value = /*$lang*/ ctx[3].header.navigation;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			nav_1 = element("nav");
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t1 = space();
    			create_component(switch_1.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			create_component(githubicon.$$.fragment);
    			t3 = space();
    			a = element("a");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(path0, "d", "M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z");
    			add_location(path0, file$2, 33, 4, 826);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "24");
    			attr_dev(svg0, "height", "24");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			add_location(svg0, file$2, 32, 2, 737);
    			attr_dev(button0, "id", "burger");
    			add_location(button0, file$2, 31, 0, 679);
    			attr_dev(path1, "d", "M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z");
    			add_location(path1, file$2, 38, 6, 1283);
    			attr_dev(svg1, "width", "24");
    			attr_dev(svg1, "height", "24");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill-rule", "evenodd");
    			attr_dev(svg1, "clip-rule", "evenodd");
    			add_location(svg1, file$2, 37, 4, 1172);
    			attr_dev(button1, "class", "close-navigation");
    			add_location(button1, file$2, 36, 2, 1115);
    			attr_dev(a, "href", a_href_value = /*$lang*/ ctx[3].header.github.slug);
    			add_location(a, file$2, 43, 4, 1578);
    			attr_dev(div0, "class", "social");
    			add_location(div0, file$2, 41, 2, 1532);
    			attr_dev(div1, "class", "navigation");
    			add_location(div1, file$2, 45, 2, 1660);
    			attr_dev(nav_1, "class", "prevent-transition");
    			toggle_class(nav_1, "show", /*state*/ ctx[1]);
    			add_location(nav_1, file$2, 35, 0, 1044);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, nav_1, anchor);
    			append_dev(nav_1, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			append_dev(nav_1, t1);
    			mount_component(switch_1, nav_1, null);
    			append_dev(nav_1, t2);
    			append_dev(nav_1, div0);
    			mount_component(githubicon, div0, null);
    			append_dev(div0, t3);
    			append_dev(div0, a);
    			append_dev(a, t4);
    			append_dev(nav_1, t5);
    			append_dev(nav_1, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			/*nav_1_binding*/ ctx[8](nav_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*toggle*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_1_changes = {};
    			if (dirty & /*$theme*/ 4) switch_1_changes.checked = /*$theme*/ ctx[2];
    			switch_1.$set(switch_1_changes);
    			if ((!current || dirty & /*$lang*/ 8) && t4_value !== (t4_value = /*$lang*/ ctx[3].header.github.label + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*$lang*/ 8 && a_href_value !== (a_href_value = /*$lang*/ ctx[3].header.github.slug)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$lang, $location, toggle*/ 56) {
    				each_value = /*$lang*/ ctx[3].header.navigation;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*state*/ 2) {
    				toggle_class(nav_1, "show", /*state*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(switch_1.$$.fragment, local);
    			transition_in(githubicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(switch_1.$$.fragment, local);
    			transition_out(githubicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(nav_1);
    			destroy_component(switch_1);
    			destroy_component(githubicon);
    			destroy_each(each_blocks, detaching);
    			/*nav_1_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $theme;
    	let $lang;
    	let $location;
    	validate_store(theme, "theme");
    	component_subscribe($$self, theme, $$value => $$invalidate(2, $theme = $$value));
    	validate_store(lang, "lang");
    	component_subscribe($$self, lang, $$value => $$invalidate(3, $lang = $$value));
    	validate_store(location$1, "location");
    	component_subscribe($$self, location$1, $$value => $$invalidate(4, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navigation", slots, []);
    	let nav;
    	let state = false;

    	let toggle = (e, s) => {
    		e.stopPropagation();
    		nav.classList.remove("prevent-transition");
    		$$invalidate(1, state = s);
    	};

    	// toggle on click outside
    	document.addEventListener("click", e => {
    		if (!nav.contains(e.target)) {
    			if (state) {
    				e.preventDefault();
    				$$invalidate(1, state = false);
    			}
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => toggle(e, !state);
    	const click_handler_1 = e => toggle(e, false);

    	function nav_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			nav = $$value;
    			$$invalidate(0, nav);
    		});
    	}

    	$$self.$capture_state = () => ({
    		link,
    		location: location$1,
    		GithubIcon: Github_icon,
    		Switch,
    		lang,
    		theme,
    		nav,
    		state,
    		toggle,
    		$theme,
    		$lang,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ("nav" in $$props) $$invalidate(0, nav = $$props.nav);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    		if ("toggle" in $$props) $$invalidate(5, toggle = $$props.toggle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		nav,
    		state,
    		$theme,
    		$lang,
    		$location,
    		toggle,
    		click_handler,
    		click_handler_1,
    		nav_1_binding
    	];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\branding.svelte generated by Svelte v3.29.0 */

    const file$3 = "src\\components\\branding.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ class: "branding" },
    		/*$$props*/ ctx[0],
    		{ width: "92" },
    		{ height: "111" },
    		{ viewBox: "-0.366 -0.382 92 111" },
    		{
    			"enable-background": "new -0.366 -0.382 92 111"
    		},
    		{ "xml:space": "preserve" }
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M71.123,12.979c2.128,0,2.688,6.057,10.728,6.057c4.94,0,8.889-4.093,8.889-9.023C90.739,3.798,85.795,0,79.729,0\r\n  C66.606,0,53.354,9.023,53.354,27.509v21.292l-9.938,2.825v4.371c7.492,0.905,9.532,5.232,9.938,11.697v29.932l30.326-8.617V84.64\r\n  c-8.187-0.989-9.87-6.059-10.022-13.547V34.418c0-8.322,0.152-9.023-3.087-16.658c-0.288-0.703-0.868-2.092-0.868-2.946\r\n  C69.703,14.098,70.141,12.979,71.123,12.979z M7.068,25.703c8.177,0.989,9.86,6.057,10.02,13.547v36.682\r\n  c0,8.315-0.159,9.017,3.087,16.648c0.295,0.705,0.861,2.102,0.861,2.948c0,0.708-0.431,1.833-1.42,1.833\r\n  c-2.128,0-2.688-6.055-10.722-6.055C3.955,91.307,0,95.4,0,100.331c0,6.214,4.944,10.013,11.01,10.013\r\n  c13.13,0,26.375-9.023,26.375-27.509v-70.12L7.068,21.332V25.703z");
    			add_location(path, file$3, 1, 0, 158);
    			set_svg_attributes(svg, svg_data);
    			toggle_class(svg, "svelte-3dbko", true);
    			add_location(svg, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ class: "branding" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0],
    				{ width: "92" },
    				{ height: "111" },
    				{ viewBox: "-0.366 -0.382 92 111" },
    				{
    					"enable-background": "new -0.366 -0.382 92 111"
    				},
    				{ "xml:space": "preserve" }
    			]));

    			toggle_class(svg, "svelte-3dbko", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Branding", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Branding extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Branding",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\header.svelte generated by Svelte v3.29.0 */
    const file$4 = "src\\components\\header.svelte";

    function create_fragment$5(ctx) {
    	let header;
    	let branding;
    	let t;
    	let navigation;
    	let current;
    	branding = new Branding({ $$inline: true });
    	navigation = new Navigation({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(branding.$$.fragment);
    			t = space();
    			create_component(navigation.$$.fragment);
    			attr_dev(header, "id", "masthead");
    			toggle_class(header, "sticky", /*sticky*/ ctx[0]);
    			add_location(header, file$4, 8, 0, 180);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(branding, header, null);
    			append_dev(header, t);
    			mount_component(navigation, header, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sticky*/ 1) {
    				toggle_class(header, "sticky", /*sticky*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(branding.$$.fragment, local);
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(branding.$$.fragment, local);
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(branding);
    			destroy_component(navigation);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	let { sticky } = $$props;
    	const writable_props = ["sticky"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("sticky" in $$props) $$invalidate(0, sticky = $$props.sticky);
    	};

    	$$self.$capture_state = () => ({ Navigation, Branding, sticky });

    	$$self.$inject_state = $$props => {
    		if ("sticky" in $$props) $$invalidate(0, sticky = $$props.sticky);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sticky];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { sticky: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sticky*/ ctx[0] === undefined && !("sticky" in props)) {
    			console.warn("<Header> was created without expected prop 'sticky'");
    		}
    	}

    	get sticky() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sticky(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\footer.svelte generated by Svelte v3.29.0 */
    const file$5 = "src\\components\\footer.svelte";

    function create_fragment$6(ctx) {
    	let footer;
    	let branding;
    	let t0;
    	let p;
    	let current;

    	branding = new Branding({
    			props: { style: "fill: var(--accent-color);" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			create_component(branding.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "©2020";
    			attr_dev(p, "class", "svelte-xdaab8");
    			add_location(p, file$5, 6, 2, 142);
    			attr_dev(footer, "class", "svelte-xdaab8");
    			add_location(footer, file$5, 4, 0, 79);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			mount_component(branding, footer, null);
    			append_dev(footer, t0);
    			append_dev(footer, p);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(branding.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(branding.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(branding);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Branding });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\app.svelte generated by Svelte v3.29.0 */
    const file$6 = "src\\app.svelte";

    // (40:6) {#if show}
    function create_if_block$1(ctx) {
    	let previous_key = /*component*/ ctx[4];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*component*/ 16 && safe_not_equal(previous_key, previous_key = /*component*/ ctx[4])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(40:6) {#if show}",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#key component}
    function create_key_block(ctx) {
    	let div;
    	let switch_instance;
    	let div_intro;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[5]];
    	var switch_value = /*component*/ ctx[4];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "id", "router");
    			add_location(div, file$6, 41, 10, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 32)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[5])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 800, delay: 150 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(41:8) {#key component}",
    		ctx
    	});

    	return block;
    }

    // (39:4) <Router let:component let:props>
    function create_default_slot(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*show*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*show*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(39:4) <Router let:component let:props>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let header;
    	let t4;
    	let main;
    	let router;
    	let t5;
    	let footer;
    	let t6;
    	let button;
    	let t7_value = /*$lang*/ ctx[2].top + "";
    	let t7;
    	let t8;
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;

    	header = new Header({
    			props: { sticky: /*topOfPage*/ ctx[0] },
    			$$inline: true
    		});

    	router = new Router_1({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ component, props }) => ({ 4: component, 5: props }),
    						({ component, props }) => (component ? 16 : 0) | (props ? 32 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Jens Hjalmarsson";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Webbutvecklare, Webbdesigner, Programmerare och mer.";
    			t3 = space();
    			create_component(header.$$.fragment);
    			t4 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			t5 = space();
    			create_component(footer.$$.fragment);
    			t6 = space();
    			button = element("button");
    			t7 = text(t7_value);
    			t8 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(h1, "class", "branding svelte-dbga9j");
    			add_location(h1, file$6, 32, 2, 718);
    			attr_dev(h2, "class", "svelte-dbga9j");
    			add_location(h2, file$6, 33, 2, 763);
    			add_location(main, file$6, 37, 2, 865);
    			attr_dev(path, "d", "M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z");
    			add_location(path, file$6, 53, 87, 1382);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "18");
    			attr_dev(svg, "height", "18");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$6, 53, 4, 1299);
    			attr_dev(button, "class", "top-of-page");
    			toggle_class(button, "show", /*topOfPage*/ ctx[0]);
    			add_location(button, file$6, 51, 2, 1167);
    			attr_dev(div, "id", "app");
    			add_location(div, file$6, 30, 0, 698);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, h2);
    			append_dev(div, t3);
    			mount_component(header, div, null);
    			append_dev(div, t4);
    			append_dev(div, main);
    			mount_component(router, main, null);
    			append_dev(div, t5);
    			mount_component(footer, div, null);
    			append_dev(div, t6);
    			append_dev(div, button);
    			append_dev(button, t7);
    			append_dev(button, t8);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*topOfPage*/ 1) header_changes.sticky = /*topOfPage*/ ctx[0];
    			header.$set(header_changes);
    			const router_changes = {};

    			if (dirty & /*$$scope, component, props, show*/ 114) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    			if ((!current || dirty & /*$lang*/ 4) && t7_value !== (t7_value = /*$lang*/ ctx[2].top + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*topOfPage*/ 1) {
    				toggle_class(button, "show", /*topOfPage*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(header);
    			destroy_component(router);
    			destroy_component(footer);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $lang;
    	validate_store(lang, "lang");
    	component_subscribe($$self, lang, $$value => $$invalidate(2, $lang = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let topOfPage = false;

    	document.addEventListener("scroll", e => {
    		if ((window.pageYOffset || document.scrollTop) - (document.clientTop || 0) > 100) {
    			$$invalidate(0, topOfPage = true);
    		} else {
    			$$invalidate(0, topOfPage = false);
    		}
    	});

    	// make sure transition plays on first mount as well
    	let show;

    	onMount(_ => {
    		$$invalidate(1, show = true);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = _ => window.scroll({ top: 0, behavior: "smooth" });

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		Router: Router_1,
    		Header,
    		Footer,
    		lang,
    		theme,
    		topOfPage,
    		show,
    		$lang
    	});

    	$$self.$inject_state = $$props => {
    		if ("topOfPage" in $$props) $$invalidate(0, topOfPage = $$props.topOfPage);
    		if ("show" in $$props) $$invalidate(1, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [topOfPage, show, $lang, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\image.svelte generated by Svelte v3.29.0 */

    const file$7 = "src\\components\\image.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (img.src !== (img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "svelte-1te1eum");
    			add_location(img, file$7, 5, 2, 101);
    			attr_dev(div, "class", "image slide-content svelte-1te1eum");
    			add_location(div, file$7, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && img.src !== (img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 2) {
    				attr_dev(img, "alt", /*alt*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Image", slots, []);
    	let { src } = $$props;
    	let { alt = "" } = $$props;
    	const writable_props = ["src", "alt"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    		if ("alt" in $$props) $$invalidate(1, alt = $$props.alt);
    	};

    	$$self.$capture_state = () => ({ src, alt });

    	$$self.$inject_state = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    		if ("alt" in $$props) $$invalidate(1, alt = $$props.alt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, alt];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { src: 0, alt: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !("src" in props)) {
    			console.warn("<Image> was created without expected prop 'src'");
    		}
    	}

    	get src() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\iframe.svelte generated by Svelte v3.29.0 */

    const file$8 = "src\\components\\iframe.svelte";

    function create_fragment$9(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "title", "inline sandbox");
    			if (iframe.src !== (iframe_src_value = /*src*/ ctx[0])) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "sandbox", "allow-pointer-lock allow-modals allow-scripts allow-same-origin");
    			attr_dev(iframe, "class", "iframe slide-content svelte-942huf");
    			add_location(iframe, file$8, 4, 0, 42);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && iframe.src !== (iframe_src_value = /*src*/ ctx[0])) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Iframe", slots, []);
    	let { src } = $$props;
    	const writable_props = ["src"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Iframe> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    	};

    	$$self.$capture_state = () => ({ src });

    	$$self.$inject_state = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src];
    }

    class Iframe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { src: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Iframe",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !("src" in props)) {
    			console.warn("<Iframe> was created without expected prop 'src'");
    		}
    	}

    	get src() {
    		throw new Error("<Iframe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Iframe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\carousel.svelte generated by Svelte v3.29.0 */
    const file$9 = "src\\components\\carousel.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let div_levels = [/*$$props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-pe14av", true);
    			add_location(div, file$9, 8, 0, 138);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[4](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$props*/ 2 && /*$$props*/ ctx[1]]));
    			toggle_class(div, "svelte-pe14av", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Carousel", slots, ['default']);
    	let parent;

    	onMount(() => {
    		
    	}); // console.log(parent.children)

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			parent = $$value;
    			$$invalidate(0, parent);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("$$scope" in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, parent });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), $$new_props));
    		if ("parent" in $$props) $$invalidate(0, parent = $$new_props.parent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [parent, $$props, $$scope, slots, div_binding];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\work-item.svelte generated by Svelte v3.29.0 */
    const file$a = "src\\components\\work-item.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (22:4) {#if tags.length}
    function create_if_block_4(ctx) {
    	let ul;
    	let each_value_2 = /*tags*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "tags");
    			add_location(ul, file$a, 22, 6, 585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tags*/ 32) {
    				each_value_2 = /*tags*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(22:4) {#if tags.length}",
    		ctx
    	});

    	return block;
    }

    // (24:8) {#each tags as tag}
    function create_each_block_2(ctx) {
    	let li;
    	let t_value = /*tag*/ ctx[12] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$a, 24, 10, 643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tags*/ 32 && t_value !== (t_value = /*tag*/ ctx[12] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(24:8) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (30:4) {#if links.length}
    function create_if_block_3(ctx) {
    	let ul;
    	let each_value_1 = /*links*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "links");
    			add_location(ul, file$a, 30, 6, 732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 1) {
    				each_value_1 = /*links*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(30:4) {#if links.length}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {#each links as link}
    function create_each_block_1(ctx) {
    	let li;
    	let a;
    	let t_value = /*link*/ ctx[9] + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[9]);
    			add_location(a, file$a, 32, 14, 797);
    			add_location(li, file$a, 32, 10, 793);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 1 && t_value !== (t_value = /*link*/ ctx[9] + "")) set_data_dev(t, t_value);

    			if (dirty & /*links*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[9])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(32:8) {#each links as link}",
    		ctx
    	});

    	return block;
    }

    // (40:2) {#if previews.length}
    function create_if_block$2(ctx) {
    	let div;
    	let carousel;
    	let current;

    	carousel = new Carousel({
    			props: {
    				class: "images",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(carousel.$$.fragment);
    			attr_dev(div, "class", "preview");
    			add_location(div, file$a, 40, 4, 915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(carousel, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const carousel_changes = {};

    			if (dirty & /*$$scope, previews*/ 32776) {
    				carousel_changes.$$scope = { dirty, ctx };
    			}

    			carousel.$set(carousel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(carousel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(carousel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(carousel);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:2) {#if previews.length}",
    		ctx
    	});

    	return block;
    }

    // (46:43) 
    function create_if_block_2(ctx) {
    	let iframe;
    	let current;

    	iframe = new Iframe({
    			props: { src: /*preview*/ ctx[6].src },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iframe.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iframe, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const iframe_changes = {};
    			if (dirty & /*previews*/ 8) iframe_changes.src = /*preview*/ ctx[6].src;
    			iframe.$set(iframe_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iframe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iframe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iframe, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(46:43) ",
    		ctx
    	});

    	return block;
    }

    // (44:8) {#if preview.type == 'image'}
    function create_if_block_1(ctx) {
    	let image;
    	let current;

    	image = new Image({
    			props: {
    				src: /*preview*/ ctx[6].src,
    				alt: /*preview*/ ctx[6].title
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(image.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(image, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const image_changes = {};
    			if (dirty & /*previews*/ 8) image_changes.src = /*preview*/ ctx[6].src;
    			if (dirty & /*previews*/ 8) image_changes.alt = /*preview*/ ctx[6].title;
    			image.$set(image_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(image, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(44:8) {#if preview.type == 'image'}",
    		ctx
    	});

    	return block;
    }

    // (43:8) {#each previews as preview}
    function create_each_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*preview*/ ctx[6].type == "image") return 0;
    		if (/*preview*/ ctx[6].type == "iframe") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(43:8) {#each previews as preview}",
    		ctx
    	});

    	return block;
    }

    // (42:6) <Carousel class="images">
    function create_default_slot$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*previews*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*previews*/ 8) {
    				each_value = /*previews*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(42:6) <Carousel class=\\\"images\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div1;
    	let div0;
    	let time;
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let p;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	let if_block0 = /*tags*/ ctx[5].length && create_if_block_4(ctx);
    	let if_block1 = /*links*/ ctx[0].length && create_if_block_3(ctx);
    	let if_block2 = /*previews*/ ctx[3].length && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			time = element("time");
    			t0 = text(/*year*/ ctx[4]);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text(/*title*/ ctx[1]);
    			t3 = space();
    			p = element("p");
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(time, "year", /*year*/ ctx[4]);
    			add_location(time, file$a, 17, 4, 465);
    			add_location(h3, file$a, 18, 4, 504);
    			add_location(p, file$a, 19, 4, 526);
    			attr_dev(div0, "class", "content");
    			add_location(div0, file$a, 15, 2, 436);
    			attr_dev(div1, "class", "work-item item");
    			add_location(div1, file$a, 14, 0, 404);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, time);
    			append_dev(time, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h3);
    			append_dev(h3, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p);
    			p.innerHTML = /*description*/ ctx[2];
    			append_dev(div0, t4);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t5);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div1, t6);
    			if (if_block2) if_block2.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*year*/ 16) set_data_dev(t0, /*year*/ ctx[4]);

    			if (!current || dirty & /*year*/ 16) {
    				attr_dev(time, "year", /*year*/ ctx[4]);
    			}

    			if (!current || dirty & /*title*/ 2) set_data_dev(t2, /*title*/ ctx[1]);
    			if (!current || dirty & /*description*/ 4) p.innerHTML = /*description*/ ctx[2];
    			if (/*tags*/ ctx[5].length) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(div0, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*links*/ ctx[0].length) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*previews*/ ctx[3].length) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*previews*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Work_item", slots, []);
    	let { links = [] } = $$props;
    	let { title = "temp title" } = $$props;
    	let { description = "temp description" } = $$props;
    	let { previews = [] } = $$props;
    	let { year = 2020 } = $$props;
    	let { tags = ["photoshop", "illustrator"] } = $$props;
    	const writable_props = ["links", "title", "description", "previews", "year", "tags"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Work_item> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("links" in $$props) $$invalidate(0, links = $$props.links);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("previews" in $$props) $$invalidate(3, previews = $$props.previews);
    		if ("year" in $$props) $$invalidate(4, year = $$props.year);
    		if ("tags" in $$props) $$invalidate(5, tags = $$props.tags);
    	};

    	$$self.$capture_state = () => ({
    		Image,
    		Iframe,
    		Carousel,
    		links,
    		title,
    		description,
    		previews,
    		year,
    		tags
    	});

    	$$self.$inject_state = $$props => {
    		if ("links" in $$props) $$invalidate(0, links = $$props.links);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("previews" in $$props) $$invalidate(3, previews = $$props.previews);
    		if ("year" in $$props) $$invalidate(4, year = $$props.year);
    		if ("tags" in $$props) $$invalidate(5, tags = $$props.tags);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [links, title, description, previews, year, tags];
    }

    class Work_item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			links: 0,
    			title: 1,
    			description: 2,
    			previews: 3,
    			year: 4,
    			tags: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Work_item",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get links() {
    		throw new Error("<Work_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set links(value) {
    		throw new Error("<Work_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Work_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Work_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Work_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Work_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get previews() {
    		throw new Error("<Work_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set previews(value) {
    		throw new Error("<Work_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get year() {
    		throw new Error("<Work_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set year(value) {
    		throw new Error("<Work_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tags() {
    		throw new Error("<Work_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tags(value) {
    		throw new Error("<Work_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*

        @usage:
        intersectionObserver({
          on: (elem, unsubscribe) => {},
          off: (elem, unsubscribe) => {}
        }, {targets: document.querySelector('.classes'), threshold: 0});
      */
     const intersectionObserver = (callbacks, options) => {

      options = {
        root: null,
        targets: [],
        threshold: 0.5,
        rootMargin: '0px',
        ...options
      };

      callbacks = {
        on: _ => {},
        off: _ => {},
        ...callbacks
      };

      // 
      let observer = new IntersectionObserver((entries, observer) => { 
        entries.forEach(entry => {
          if(entry.isIntersecting){
            callbacks.on.call(null, entry, _ => observer.unobserve(entry.target));
          }else {
            callbacks.off.call(null, entry, _ => observer.unobserve(entry.target));
          }
        });
      }, options);
      Array.from(options.targets).map(elem => observer.observe(elem));

    };

    /* src\components\worksection.svelte generated by Svelte v3.29.0 */
    const file$b = "src\\components\\worksection.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (32:2) {#each items as item}
    function create_each_block$2(ctx) {
    	let workitem;
    	let current;
    	const workitem_spread_levels = [/*item*/ ctx[3]];
    	let workitem_props = {};

    	for (let i = 0; i < workitem_spread_levels.length; i += 1) {
    		workitem_props = assign(workitem_props, workitem_spread_levels[i]);
    	}

    	workitem = new Work_item({ props: workitem_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(workitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(workitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const workitem_changes = (dirty & /*items*/ 1)
    			? get_spread_update(workitem_spread_levels, [get_spread_object(/*item*/ ctx[3])])
    			: {};

    			workitem.$set(workitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(workitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(workitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(workitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(32:2) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let section;
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "id", "work");
    			add_location(section, file$b, 30, 0, 722);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			/*section_binding*/ ctx[2](section);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 1) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			/*section_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Worksection", slots, []);
    	let parent;

    	onMount(() => {
    		intersectionObserver(
    			{
    				// on
    				on: entry => {
    					intersections.add(entry);
    					entry.target.classList.add("show");
    					entry.target.classList.add("once");
    				},
    				// off
    				off: entry => {
    					entry.target.classList.remove("show");
    					intersections.remove(entry);
    				}
    			},
    			{
    				targets: parent.querySelectorAll(".item"),
    				threshold: 0
    			}
    		);
    	});

    	let { items = [] } = $$props;
    	const writable_props = ["items"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Worksection> was created with unknown prop '${key}'`);
    	});

    	function section_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			parent = $$value;
    			$$invalidate(1, parent);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		WorkItem: Work_item,
    		intersections,
    		intersectionObserver,
    		parent,
    		items
    	});

    	$$self.$inject_state = $$props => {
    		if ("parent" in $$props) $$invalidate(1, parent = $$props.parent);
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items, parent, section_binding];
    }

    class Worksection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Worksection",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get items() {
    		throw new Error("<Worksection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Worksection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\work.svelte generated by Svelte v3.29.0 */
    const file$c = "src\\pages\\work.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (7:2) {#each $lang.work.intro as item}
    function create_each_block$3(ctx) {
    	let p;
    	let html_tag;
    	let raw_value = /*item*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = space();
    			html_tag = new HtmlTag(t);
    			add_location(p, file$c, 7, 4, 227);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			html_tag.m(raw_value, p);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$lang*/ 1 && raw_value !== (raw_value = /*item*/ ctx[1] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(7:2) {#each $lang.work.intro as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let section;
    	let t;
    	let worksection;
    	let current;
    	let each_value = /*$lang*/ ctx[0].work.intro;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	worksection = new Worksection({
    			props: { items: /*$lang*/ ctx[0].work.items },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(worksection.$$.fragment);
    			attr_dev(section, "id", "intro");
    			attr_dev(section, "class", "content-max text-center");
    			add_location(section, file$c, 5, 0, 133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(worksection, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$lang*/ 1) {
    				each_value = /*$lang*/ ctx[0].work.intro;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const worksection_changes = {};
    			if (dirty & /*$lang*/ 1) worksection_changes.items = /*$lang*/ ctx[0].work.items;
    			worksection.$set(worksection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(worksection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(worksection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(worksection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $lang;
    	validate_store(lang, "lang");
    	component_subscribe($$self, lang, $$value => $$invalidate(0, $lang = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Work", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Work> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ lang, WorkSection: Worksection, $lang });
    	return [$lang];
    }

    class Work extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Work",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\pages\lab.svelte generated by Svelte v3.29.0 */
    const file$d = "src\\pages\\lab.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (7:2) {#each $lang.lab.intro as item}
    function create_each_block$4(ctx) {
    	let p;
    	let html_tag;
    	let raw_value = /*item*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = space();
    			html_tag = new HtmlTag(t);
    			add_location(p, file$d, 7, 4, 226);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			html_tag.m(raw_value, p);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$lang*/ 1 && raw_value !== (raw_value = /*item*/ ctx[1] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(7:2) {#each $lang.lab.intro as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let section;
    	let t;
    	let worksection;
    	let current;
    	let each_value = /*$lang*/ ctx[0].lab.intro;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	worksection = new Worksection({
    			props: { items: /*$lang*/ ctx[0].lab.items },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(worksection.$$.fragment);
    			attr_dev(section, "id", "intro");
    			attr_dev(section, "class", "content-max text-center");
    			add_location(section, file$d, 5, 0, 133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(worksection, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$lang*/ 1) {
    				each_value = /*$lang*/ ctx[0].lab.intro;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const worksection_changes = {};
    			if (dirty & /*$lang*/ 1) worksection_changes.items = /*$lang*/ ctx[0].lab.items;
    			worksection.$set(worksection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(worksection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(worksection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(worksection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $lang;
    	validate_store(lang, "lang");
    	component_subscribe($$self, lang, $$value => $$invalidate(0, $lang = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Lab", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Lab> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ lang, WorkSection: Worksection, $lang });
    	return [$lang];
    }

    class Lab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lab",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\pages\about.svelte generated by Svelte v3.29.0 */
    const file$e = "src\\pages\\about.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (12:4) {#each $lang.about.intro as item}
    function create_each_block$5(ctx) {
    	let p;
    	let html_tag;
    	let raw_value = /*item*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = space();
    			html_tag = new HtmlTag(t);
    			add_location(p, file$e, 12, 6, 319);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			html_tag.m(raw_value, p);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$lang*/ 1 && raw_value !== (raw_value = /*item*/ ctx[1] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(12:4) {#each $lang.about.intro as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let section;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h3;
    	let t2;
    	let each_value = /*$lang*/ ctx[0].about.intro;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Hello!";
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (img.src !== (img_src_value = "/assets/images/prof.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Jens Hjalmarsson");
    			add_location(img, file$e, 6, 4, 154);
    			attr_dev(div0, "class", "profile");
    			add_location(div0, file$e, 5, 2, 127);
    			add_location(h3, file$e, 10, 4, 257);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$e, 9, 2, 230);
    			attr_dev(section, "id", "about");
    			attr_dev(section, "class", "content-max text-center");
    			add_location(section, file$e, 4, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, img);
    			append_dev(section, t0);
    			append_dev(section, div1);
    			append_dev(div1, h3);
    			append_dev(div1, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$lang*/ 1) {
    				each_value = /*$lang*/ ctx[0].about.intro;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $lang;
    	validate_store(lang, "lang");
    	component_subscribe($$self, lang, $$value => $$invalidate(0, $lang = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ lang, $lang });
    	return [$lang];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\pages\contact.svelte generated by Svelte v3.29.0 */
    const file$f = "src\\pages\\contact.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each $lang.contact as item}
    function create_each_block$6(ctx) {
    	let p;
    	let html_tag;
    	let raw_value = /*item*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = space();
    			html_tag = new HtmlTag(t);
    			add_location(p, file$f, 6, 4, 162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			html_tag.m(raw_value, p);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$lang*/ 1 && raw_value !== (raw_value = /*item*/ ctx[1] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(6:2) {#each $lang.contact as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let section;
    	let each_value = /*$lang*/ ctx[0].contact;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "id", "intro");
    			attr_dev(section, "class", "content-max text-center");
    			add_location(section, file$f, 4, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$lang*/ 1) {
    				each_value = /*$lang*/ ctx[0].contact;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $lang;
    	validate_store(lang, "lang");
    	component_subscribe($$self, lang, $$value => $$invalidate(0, $lang = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Contact", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ lang, $lang });
    	return [$lang];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\pages\error.svelte generated by Svelte v3.29.0 */

    const { Error: Error_1$1 } = globals;
    const file$g = "src\\pages\\error.svelte";

    function create_fragment$h(ctx) {
    	let section;
    	let h3;
    	let t1;
    	let p;
    	let t2;
    	let em;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let a;
    	let link_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h3 = element("h3");
    			h3.textContent = "404 Page not found";
    			t1 = space();
    			p = element("p");
    			t2 = text("The page ");
    			em = element("em");
    			t3 = text("`");
    			t4 = text(/*route*/ ctx[0]);
    			t5 = text("`");
    			t6 = text(" could not be found. ");
    			a = element("a");
    			a.textContent = "Go back home";
    			add_location(h3, file$g, 6, 2, 146);
    			add_location(em, file$g, 8, 13, 195);
    			attr_dev(a, "href", "/");
    			add_location(a, file$g, 8, 52, 234);
    			add_location(p, file$g, 7, 2, 177);
    			attr_dev(section, "class", "content-max text-center");
    			add_location(section, file$g, 5, 0, 101);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h3);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(p, t2);
    			append_dev(p, em);
    			append_dev(em, t3);
    			append_dev(em, t4);
    			append_dev(em, t5);
    			append_dev(p, t6);
    			append_dev(p, a);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*route*/ 1) set_data_dev(t4, /*route*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Error", slots, []);
    	let { route = "" } = $$props;
    	const writable_props = ["route"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Error> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("route" in $$props) $$invalidate(0, route = $$props.route);
    	};

    	$$self.$capture_state = () => ({ link, route });

    	$$self.$inject_state = $$props => {
    		if ("route" in $$props) $$invalidate(0, route = $$props.route);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [route];
    }

    class Error$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { route: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Error",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get route() {
    		throw new Error_1$1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set route(value) {
    		throw new Error_1$1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let prevPage = undefined;
    const sameRouteCheck = (fn) => {
      if(location.pathname != prevPage){
        prevPage = location.pathname;
        fn.call(null);
      }
    };

    const app = router({
      initial: location.pathname
    });

    // general error handler
    app.catch((req, res) => {
      sameRouteCheck(_ => {
        res.send(Error$1, {route: req.path});
      });
    });

    // make sure we don't travel to the same route
    app.use((req, res, next) => {
      sameRouteCheck(_ => {
        next();
      });
    });

    app.use((req, res, next) => {
      // wrap in timeout to push it back to the stack
      setTimeout(() => window.scroll({top: 0, behavior: 'smooth'}), 10);
      next();
    });

    app.get('/', (req, res) => res.send(Work));
    app.get('/lab', (req, res) => res.send(Lab));
    app.get('/about', (req, res) => res.send(About));
    app.get('/contact', (req, res) => res.send(Contact));

    // initialize svelte
    var main = new App({ target: document.body });

    return main;

}());
//# sourceMappingURL=bundle.js.map
