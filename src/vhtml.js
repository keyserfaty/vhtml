// escape an attribute
let esc = str => String(str).replace(/[&<>"']/g, s=>`&${map[s]};`);
let map = {'&':'amp','<':'lt','>':'gt','"':'quot',"'":'apos'};

let sanitized = {};

/** Hyperscript reviver that constructs a sanitized HTML string. */
export default function h(name, attrs) {
	let stack=[];
	for (let i=arguments.length; i-- > 2; ) {
		stack.push(arguments[i]);
	}

	// Sortof component support!
	if (typeof name==='function') {
		if (attrs) attrs.children = stack.reverse();
		return name(attrs);
		// return name(attrs, stack.reverse());
	}

	let s = `<${name}`;
	if (attrs) for (let i in attrs) {
		if (attrs[i]!==false && attrs[i]!=null) {
			s += ` ${esc(i)}="${esc(attrs[i])}"`;
		}
	}
	s += '>';

	while (stack.length) {
		let child = stack.pop();
		if (child) {
			if (child.pop) {
				for (let i=child.length; i--; ) stack.push(child[i]);
			}
			else {
				s += sanitized[child]===true ? child : esc(child);
			}
		}
	}

	sanitized[s += `</${name}>`] = true;
	return s;
}
