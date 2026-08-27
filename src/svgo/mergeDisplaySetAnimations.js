module.exports = {
  name: 'mergeDisplaySetAnimations',
  type: 'visitor',
  active: true,
  fn: () => ({
    element: {
      enter: (node) => {
        if (node.name !== 'use' || !Array.isArray(node.children)) return;

        const parseTime = t => {
          const s = String(t).trim().replace(/s$/, '');
          return isNaN(s) ? 0 : parseFloat(s);
        };

        const isDisplaySet = el =>
          el.type === 'element' &&
          el.name === 'set' &&
          el.attributes.attributeName === 'display' &&
          el.attributes.fill === 'freeze' &&
          el.attributes.begin != null &&
          el.attributes.dur != null &&
          el.attributes.to != null;

        const out = [];
        const ch = node.children;
        let i = 0;

        while (i < ch.length) {
          if (!isDisplaySet(ch[i])) {
            out.push(ch[i]);
            i++;
            continue;
          }

          const toValue = ch[i].attributes.to;
          const group = [];

          while (i < ch.length && isDisplaySet(ch[i]) && ch[i].attributes.to === toValue) {
            group.push(ch[i]);
            i++;
          }

          if (group.length === 1) {
            out.push(group[0]);
          } else {
            const begin = group[0].attributes.begin;
            const totalDur = group.reduce((sum, el) => sum + parseTime(el.attributes.dur), 0);
            out.push({
              type: 'element',
              name: 'set',
              attributes: {
                attributeName: 'display',
                to: toValue,
                begin: begin,
                dur: totalDur.toFixed(3).replace(/\.?0+$/, '') + 's',
                fill: 'freeze',
              },
              children: []
            });
          }
        }

        node.children = out;
      }
    }
  })
};
