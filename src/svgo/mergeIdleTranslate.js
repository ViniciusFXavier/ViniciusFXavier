module.exports = {
  name: 'mergeIdleTranslate',
  type: 'visitor',
  active: true,
  fn: () => ({
    element: {
      enter: (node) => {
        if (!Array.isArray(node.children) || node.children.length < 2) return;

        const parseTime = t => {
          const s = String(t).trim().replace(/s$/, '');
          return isNaN(s) ? 0 : parseFloat(s);
        };

        const isIdleAnim = el =>
          el.type === 'element' &&
          el.name === 'animateTransform' &&
          el.attributes.attributeName === 'transform' &&
          el.attributes.type === 'translate' &&
          String(el.attributes.from).trim() === '0 0' &&
          String(el.attributes.to).trim() === '0 0' &&
          el.attributes.fill === 'freeze' &&
          el.attributes.additive === 'sum' &&
          el.attributes.begin != null &&
          el.attributes.dur != null;

        const out = [];
        const ch = node.children;
        let i = 0;

        while (i < ch.length) {
          if (!isIdleAnim(ch[i])) {
            out.push(ch[i]);
            i++;
            continue;
          }

          const group = [];
          const begin = ch[i].attributes.begin;

          while (i < ch.length && isIdleAnim(ch[i])) {
            group.push(ch[i]);
            i++;
          }

          if (group.length === 1) {
            out.push(group[0]);
          } else {
            const totalDur = group.reduce(
              (sum, el) => sum + parseTime(el.attributes.dur),
              0
            );

            out.push({
              type: 'element',
              name: 'animateTransform',
              attributes: {
                attributeName: 'transform',
                type: 'translate',
                from: '0 0',
                to: '0 0',
                begin: begin,
                dur: totalDur.toFixed(3).replace(/\.?0+$/, '') + 's',
                fill: 'freeze',
                additive: 'sum',
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
