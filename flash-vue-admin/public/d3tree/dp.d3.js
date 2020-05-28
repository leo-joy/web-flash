//var originUrl = 'http://127.0.0.1:8082' // 本地服务器接口地址
// var originUrl = 'http://10.1.19.76:8092'; // 测试服务器接口地址
var originUrl = 'http://faren.agile.com.cn/prod-api'; // 正式服务器接口地址
var allData = {}
var mysvg = []
var rootName = '' // 根节点的名字
var rootRectWidth = 0 // 根节点rect的宽度
var downwardLength = 0 // 下方展开树的个数
var upwardLength = 0 // 上方展开树的个数
/**
 * 初始化数据加载。
 * @param {url} 远程接口地址.
 * @param {id}  根公司的id
 */
var initChartData = function(url, id) {
  console.log('股权架构图请求后台接口地')
  // 请求根节点公司数据
  d3.xhr(url + '/lpm/businesslicense/list?page=1&limit=1&id=' + id, function(err, XMLHttpRequest) {
    if (err) {
      return false
    }
    var rootCompanyData = XMLHttpRequest.response
    rootCompanyData = JSON.parse(rootCompanyData)
    rootCompanyData = rootCompanyData.data.records
    var rootCompanyId = rootCompanyData[0].id

    // 请求投资公司数据
    d3.xhr(url + '/lpm/capital/list?page=1&limit=1000&enterpriseCode=' + rootCompanyId, function(err, XMLHttpRequest) {
      if (err) {
        return false
      }
      var investCompanyData = XMLHttpRequest.response
      investCompanyData = JSON.parse(investCompanyData)
      investCompanyData = investCompanyData.data.records

      // 请求分公司数据
      d3.xhr(url + '/lpm/invest/company/list?page=1&limit=1000&enterpriseCode=' + rootCompanyId, function(err, XMLHttpRequest) {
        if (err) {
          return false
        }
        var branchCompanyData = XMLHttpRequest.response
        branchCompanyData = JSON.parse(branchCompanyData)
        branchCompanyData = branchCompanyData.data.records

        // 数据组合
        function initD3Data(type, companyData) {
          const obj = {}
          obj['direction'] = type
          obj['name'] = 'origin'
          companyData.forEach(element => {
            element['name'] = element.branchCompanyName
            element['hasHumanholding'] = element.shareholderMold === 1
            element['receiptor'] = element.legalRepresentative
            element['hasChildren'] = true
            element['amount'] = element.registeredCapital
            element['subscribedCapitalContribution'] = element.subscribedCapitalContribution
            element['percent'] = element.proportion
            element['children'] = []
          })
          obj['children'] = companyData
          return obj
        }

        // 遍历组合数
        allData['upward'] = initD3Data('upward', investCompanyData)
        allData['downward'] = initD3Data('downward', branchCompanyData)
        var d3GenerationChart = new treeChart(d3)
        d3GenerationChart.drawChart(rootCompanyData[0].enterpriseName, allData)
        // cb(rootCompanyData[0].enterpriseName,allData)
        // return allData
      })
    })
  })
}

/**
 * Initialize tree chart object and data loading.
 * 初始化树图对象和数据加载。
 * @param {Object} d3Object Object for d3, injection used for testing.
 * d3Object 是d3.js 对象
 */
var treeChart = function(d3Object) {
  this.d3 = d3Object
  // Initialize the direction texts.
  // 设置树展开的方向
  this.directions = ['upward', 'downward']
}

/**
 * Set variable and draw chart.
 * 传入数据并且绘制树
 */
treeChart.prototype.drawChart = function(name, allData) {
  // First get tree data for both directions.
  // 获取树的数据和树的绘制方向
  this.treeData = {} // 树的数据
  var self = this
  // 根据树的方向给treeData 初始化值
  self.directions.forEach(function(direction) {
    self.treeData[direction] = allData[direction]
  })
  // 设置根节点树的名称
  rootName = name
  // 计算根节点名称的长度，确定根节点绘制框的长度
  rootRectWidth = rootName.length * 15
  // 获得upward第一级节点的个数
  upwardLength = allData.upward.children.length
  // 获得downward第一级节点的个数
  downwardLength = allData.downward.children.length

  mysvg = self.graphTree(self.getTreeConfig())
}

/**
 * Get tree dimension configuration.
 * 获取并返回树的配置相关信息，含树尺寸大小的treeConfig对象及中心点位置，动画执行时长等
 * @return {Object} treeConfig Object containing tree dimension size
 *     and central point location.
 *
 */
treeChart.prototype.getTreeConfig = function() {
  // 确定绘制画布的边界
  var treeConfig = { 'margin': { 'top': 10, 'right': 5, 'bottom': 0, 'left': 30 }}
  // This will be the maximum dimensions
  // 如果要保存整个架构图，就要加大画布的尺寸， 比如：1366 设置为 3000
  // 画布的宽度
  treeConfig.chartWidth = (1366 - treeConfig.margin.right - treeConfig.margin.left)
  // 画布的高度
  treeConfig.chartHeight = (768 - treeConfig.margin.top - treeConfig.margin.bottom)
  // 开始绘制的中心点的x,y坐标
  treeConfig.centralHeight = treeConfig.chartHeight / 2
  treeConfig.centralWidth = treeConfig.chartWidth / 2
  // 连接线的长度
  treeConfig.linkLength = 150
  // 绘制动画的执行时间
  treeConfig.duration = 300
  // 返回配置对象
  return treeConfig
}

/**
 * Graph tree based on the tree config.
 * 基于树配置的图形树
 * @param {Object} config Object for chart dimension and central location.
 * 输入参数是树的配置信息
 */

treeChart.prototype.graphTree = function(config) {
  // self 绘制树的全部对象的集合，包含（d3，directions，treeData）
  var self = this
  var d3 = this.d3
  // 获取配置信息中的连接线的长度和动画时长
  var linkLength = config.linkLength
  var duration = config.duration

  var hasChildNodeArr = []
  // id is used to name all the nodes;
  var id = 0

  // 创建新的斜线生成器
  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y] })

  // 创建一个缩放行为
  var zoom = d3.behavior.zoom()
    .scaleExtent([0.1, 2]) // 设置比例因子
    .on('zoom', redraw) //

  // 获取画布
  var svg = d3.select('svg')
    .attr('width', config.chartWidth + config.margin.right + config.margin.left) // 设置画布的宽度
    .attr('height', config.chartHeight + config.margin.top + config.margin.bottom) // 设置画布的高度
    .on('mousedown', disableRightClick) // 注册鼠标按下事件
    .call(zoom) // 执行一个缩放行为
    .on('dblclick.zoom', null) //

  // 创建一个元素g,一个元素的容器，节点的绘制区域框，
  var treeG = svg.append('g')
    .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')')

  // 箭头(下半部分)
  var markerDown = svg.append('marker')
    .attr('id', 'resolvedDown')
    .attr('markerUnits', 'strokeWidth')// 设置为strokeWidth箭头会随着线的粗细发生变化
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('viewBox', '0 -5 10 10')// 坐标系的区域
    .attr('refX', 0)// 箭头坐标
    .attr('refY', 0)
    .attr('markerWidth', 12)// 标识的大小
    .attr('markerHeight', 12)
    .attr('orient', '90')// 绘制方向，可设定为：auto（自动确认方向）和 角度值
    .attr('stroke-width', 2)// 箭头宽度
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')// 箭头的路径
    .attr('fill', '#000')// 箭头颜色

  // 箭头(上半部分)
  var markerUp = svg.append('marker')
    .attr('id', 'resolvedUp')
    .attr('markerUnits', 'strokeWidth')// 设置为strokeWidth箭头会随着线的粗细发生变化
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('viewBox', '0 -5 10 10')// 坐标系的区域
    .attr('refX', 10)// 箭头坐标
    .attr('refY', 0)
    .attr('markerWidth', 12)// 标识的大小
    .attr('markerHeight', 12)
    .attr('orient', '90')// 绘制方向，可设定为：auto（自动确认方向）和 角度值
    .attr('stroke-width', 2)// 箭头宽度
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')// 箭头的路径
    .attr('fill', '#000')// 箭头颜色

  // Initialize the tree nodes and update chart.
  // 初始化树节点和更新图表
  for (var d in this.directions) {
    var direction = this.directions[d]
    var data = self.treeData[direction]
    data.x0 = config.centralWidth
    data.y0 = config.centralHeight
    // Hide all children nodes other than direct generation.
    // 隐藏除直接生成之外的所有子节点
    data.children.forEach(collapse)
    // 绘制上方下方的树
    update(data, data, treeG)
  }

  return svg

  /**
     * Update nodes and links based on direction data.
     * @param {Object} source Object for current chart distribution to identify
     *    where the children nodes will branch from.
     * @param {Object} originalData Original data object to get configurations.
     * @param {Object} g Handle to svg.g.
     */
  function update(source, originalData, g) {
    // Set up the upward vs downward separation.
    var direction = originalData['direction'] // 获取方向
    var forUpward = direction === 'upward' // 是否向上方向
    var node_class = direction + 'Node' // 节点的样式
    var link_class = direction + 'Link' // 连线的样式
    var downwardSign = (forUpward) ? -1 : 1 // 方向值
    var nodeColor = (forUpward) ? '#37592b' : '#8b4513' // 节点的颜色, 没有用到

    var isExpand = false // 是否展开
    var statusUp = true
    var statusDown = true
    // Reset tree layout based on direction, since the downward chart has
    // way too many nodes to fit in the screen, while we want a symmetric
    // view for upward chart.
    var nodeSpace = 130 // 节点之间的间距
    // 将节点树整齐地定位
    var tree = d3.layout.tree().sort(sortByDate).nodeSize([nodeSpace, 0])
    /* if (forUpward) {
            tree.size([config.chartWidth, config.chartHeight]);//树图定宽
        } */

    // 计算并返回指定结点的子节点信息
    var nodes = tree.nodes(originalData)
    // 计算它们与父结点的连接信息
    var links = tree.links(nodes)

    // Offset x-position for downward to view the left most record.
    // 计算x位置偏移量
    var offsetX = -config.centralWidth

    // 向一边发展的树杈
    /* if (!forUpward) {
            var childrenNodes = originalData[(originalData.children) ? 'children' : '_children'];
            offsetX = d3.min([childrenNodes[0].x, 0]);
        } */
    // Normalize for fixed-depth.
    // 规范化为固定高度
    nodes.forEach(function(d) {
      d.y = downwardSign * (d.depth * linkLength) + config.centralHeight
      d.x = d.x - offsetX
      // Position for origin node.
      // 原点位置
      if (d.name == 'origin') {
        d.x = config.centralWidth
        d.y += downwardSign * 0// 上下两树图根节点之间的距离
      }
    })

    // Update the node.
    // 获取页面节点，更新节点
    var node = g.selectAll('g.' + node_class)
      .data(nodes, function(d) { return d.id || (d.id = ++id) })
    // Enter any new nodes at the parent's previous position.
    // 在父节点之前的位置输入任何新节点

    // 重新全部绘制框节点框架
    var nodeEnter = node.enter().append('g')
      .attr('class', node_class) // 设置框的样式
      .attr('transform', function(d) {
        return 'translate(' + source.x0 + ',' + source.y0 + ')'
      })
      .style('cursor', function(d) {
        return (d.name === 'origin') ? '' : (d.children || d._children) ? 'pointer' : ''
      })
      .on('click', click)

    // 重绘节点的矩形框
    nodeEnter.append('svg:rect')
      .attr('x', function(d) {
        return (d.name === 'origin') ? -(rootRectWidth / 2) : -60
      })
      .attr('y', function(d) {
        return (d.name === 'origin') ? -20 : forUpward ? -52 : 12
      })
      .attr('width', function(d) { // 矩形框的宽度
        return (d.name == 'origin') ? rootRectWidth : 120
      })
      .attr('height', 50) // 矩形框的高度
      .attr('rx', 3) // 矩形框的圆角设置
      .style('stroke', function(d) { // 设置边框的颜色
        return (d.name === 'origin') ? '#bbbbbb' : '#cccccc'
      })
      .style('fill', function(d) { // 设置内部填充的颜色
        return (d.name === 'origin') ? '#eeeeee' : '#efefef'
      })

    // 展开和收起圆圈
    nodeEnter.append('circle')
      .attr('r', 1e-6)
    // 公司名称的第一行文字
    nodeEnter.append('text')
      .attr('class', 'linkname')
      .attr('x', function(d) {
        return (d.name === 'origin') ? '0' : '-55'
      })
      .attr('dy', function(d) {
        return (d.name === 'origin') ? '.70em' : forUpward ? '-35' : '29'
      })
      .attr('text-anchor', function(d) {
        return (d.name === 'origin') ? 'middle' : 'start'
      })
      .attr('fill', '#000')
      .text(function(d) {
        // Text for origin node.
        if (d.name === 'origin') {
          // return ((forUpward) ? '根节点TOP' : '根节点Bottom');
          return rootName
        }
        // Text for summary nodes.
        if (d.repeated) {
          return '[Recurring] ' + d.name
        }
        return (d.name.length > 10) ? d.name.substr(0, 10) : d.name
      })
      .style({
        'fill-opacity': 1e-6,
        'fill': function(d) { if (d.name === 'origin') { return '#000' } },
        'font-size': function(d) { return (d.name === 'origin') ? 14 : 11 },
        'cursor': 'pointer'
      })
      .on('click', function() {
        // alert(1);
        // window.open('http://www.baidu.com')
      })

    // 公司名称的第二行文字
    nodeEnter.append('text')
      .attr('class', 'linkname')
      .attr('x', '-55')
      .attr('dy', function(d) {
        return (d.name === 'origin') ? '.35em' : forUpward ? '-22' : '42'
      })
      .attr('text-anchor', function() {
        return (d.name === 'origin') ? 'middle' : 'start'
      })
      .text(function(d) {
        return d.name.substr(10, d.name.length)
      })
      .style({
        'fill': '#000',
        'font-size': function(d) { return (d.name == 'origin') ? 14 : 11 },
        'cursor': 'pointer'
      })
      .on('click', function() {
        // alert(1);
        // window.open('http://www.baidu.com')
      })

    // 绘制注册资本
    nodeEnter.append('text')
      .attr('x', '-55')
      .attr('dy', function(d) {
        return (d.name === 'origin') ? '.35em' : forUpward ? '-10' : '55'
      })
      .attr('text-anchor', 'start')
      .attr('class', 'linkname')
      .style('fill', '#666666')
      .style('font-size', 10)
      .text(function(d) {
        var str = ''
        if (forUpward) {
          str = !d.subscribedCapitalContribution ? '' : '认缴金额：' + d.subscribedCapitalContribution + '万元'
        } else {
          str = !d.amount ? '' : '认缴金额：' + d.amount + '万元'
        }
        return (str.length > 13) ? str.substr(0, 13) + '..' : str
      })

    // 绘制股权占比
    nodeEnter.append('text')
      .attr('x', '-23')
      .attr('dy', function(d) {
        return (d.name == 'origin') ? '.35em' : forUpward ? '15' : '-30'
      })
      .attr('text-anchor', 'start')
      .attr('class', 'linkname')
      .style('fill', 'green')
      .style('font-size', 10)
      .text(function(d) {
        return !d.percent ? '' : '股权（' + d.percent + '%)'
      })

    // Transition nodes to their new position.
    // 原有节点更新到新位置
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    // 展开缩放的图标的圆圈
    nodeUpdate.select('circle')
      .attr('r', function(d) {
        return (d.name == 'origin') ? 0 : (hasChildNodeArr.indexOf(d) == -1) ? 0 : 6
      })
      .attr('cy', function(d) {
        return (d.name == 'origin') ? -20 : (forUpward) ? -60 : 70
      })
      .style('fill', function(d) {
        return hasChildNodeArr.indexOf(d) != -1 ? '#fff' : ''
        // if (d._children || d.children) { return "#fff"; } else { return "rgba(0,0,0,0)"; }
      })
      .style('stroke', function(d) {
        return hasChildNodeArr.indexOf(d) != -1 ? '#8b4513' : ''
        // if (d._children || d.children) { return "#8b4513"; } else { return "rgba(0,0,0,0)"; }
      })
      .style('fill-opacity', function(d) {
        if (d.children) { return 0.35 }
      })
    // Setting summary node style as class as mass style setting is
    // not compatible to circles.
      .style('stroke-width', function(d) {
        if (d.repeated) { return 5 }
      })

    // 代表是否展开的+-号
    nodeEnter.append('svg:text')
      .attr('class', 'isExpand')
      .attr('x', '0')
      .attr('dy', function(d) {
        return forUpward ? -57 : 73
      })
      .attr('text-anchor', 'middle')
      .style('fill', '#000')
      .text(function(d) {
        if (d.name == 'origin') {
          return ''
        }
        return hasChildNodeArr.indexOf(d) != -1 ? '+' : ''
        /* if (d._children || d.children) {
                    return "+";
                } */
      })

    nodeUpdate.select('text').style('fill-opacity', 1)

    //* *****************************************法定代表人 start******************************************//
    // 提示框
    var tsk = nodeEnter.append('svg:rect')
      .attr('x', -60)
      .attr('y', function(d) {
        return forUpward ? -86 : -20
      })
      .attr('width', function(d) {
        if (d.name == 'origin') {
          return 0
        } else {
          return d.hasHumanholding ? 120 : 0// 如果有法定代表人
        }
      })
      .attr('height', 20)
      .style('stroke', function(d) {
        return '#006666'
      })
      .style('fill', function(d) {
        return '#006666'
      })
    // 三角形
    nodeEnter.append('svg:path')
      .attr('fill', '#006666')
      .attr('d', function(d) {
        if (d.name == 'origin') {
          return ''
        } else {
          return d.hasHumanholding ? (forUpward ? 'M-60 -66 L-40 -66 L-50 -52 Z' : 'M-60 0 L-40 0 L-50 12 Z') : ''// 如果有法定代表人
        }
      })
    nodeEnter.append('svg:text')
      .attr('x', '-58')
      .attr('dy', function(d) {
        return forUpward ? '-73' : '-7'
      })
      .attr('text-anchor', 'start')
      .style('fill', '#fff')
      .style('font-size', 10)
      .text(function(d) {
        if (d.receiptor) {
          var str = d.receiptor
          str = str.length > 6 ? str.substr(0, 6) + '..' : (str)
          return d.hasHumanholding ? '法定代表人：' + str : ''// 如果有法定代表人
        }
      })
    //* *****************************************法定代表人 end******************************************//

    // Transition exiting nodes to the parent's new position.
    // 将现有节点转换到父节点的新位置
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr('transform', function(d) {
        return 'translate(' + source.x + ',' + source.y + ')'
      })
      .remove() // 移除关闭的元素集合
    // 设置展开和收起图标的样式
    nodeExit.select('circle')
      .attr('r', 1e-6)
    nodeExit.select('text')
      .style('fill-opacity', 1e-6)

    // Update the links.----------------------------------------------------------------------------
    // 更新连接线
    var link = g.selectAll('path.' + link_class)
      .data(links, function(d) { return d.target.id })

    // Enter any new links at the parent's previous position.
    link.enter().insert('path', 'g')
      .attr('class', link_class)
      .attr('d', function(d) {
        var o = { x: source.x0, y: source.y0 }
        return diagonal({ source: o, target: o })
      })
      .attr('marker-end', function(d) {
        return forUpward ? 'url(#resolvedUp)' : 'url(#resolvedDown)'
      })// 根据箭头标记的id号标记箭头;
      .attr('id', function(d, i) {
        return 'mypath' + i
      })
    // Transition links to their new position.
    // 修改连接线的坐标
    link.transition()
      .duration(duration)
      .attr('d', diagonal)
    // Transition exiting nodes to the parent's new position.
    // 去除被关闭元素的连接线
    link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = { x: source.x, y: source.y }
        return diagonal({ source: o, target: o })
      })
      .remove()
    // Stash the old positions for transition.
    // 保存信息，等下一次交互.
    nodes.forEach(function(d) {
      d.x0 = d.x
      d.y0 = d.y
    })

    mysvg = svg
    return svg

    /**
         * Tree function to toggle on click.
         * 点击某个节点的回调函数
         * @param {Object} d data object for D3 use.
         */
    function click(d) {
      // console.log(d)
      // setDData(d)
      // d = getDData()
      // console.log('d', d)
      // console.log('originalData', originalData)
      // 请求投资公司数据
      var _that = this
      var id = d.branchCompanyCode
      var interfaceName = originalData.direction === 'upward' ? 'capital' : 'invest/company'

      var url = originUrl + '/lpm/' + interfaceName + '/list?page=1&limit=1000&enterpriseCode=' + id
      console.log(id)

      d3.xhr(url, function(err, XMLHttpRequest) {
        if (err) {
          return false
        }
        var investCompanyData = XMLHttpRequest.response
        investCompanyData = JSON.parse(investCompanyData)
        investCompanyData = investCompanyData.data.records
        if (investCompanyData.length == 0) {
          console.log('没有设置分公司或投资公司')
        }
        d._children = []
        for (let i = 0; i < investCompanyData.length; i++) {
          const obj = {}
          obj['name'] = investCompanyData[i].branchCompanyName
          obj['hasHumanholding'] = false
          obj['hasChildren'] = false
          obj['amount'] = investCompanyData[i].registeredCapital
          obj['subscribedCapitalContribution'] = investCompanyData[i].subscribedCapitalContribution
          obj['percent'] = investCompanyData[i].proportion
          obj['children'] = []
          d._children.push(obj)
        }
        if (forUpward) {
          if (d._children) {
            console.log('股东--ok')
          } else {
            console.log('股东--no')
          }
        } else {
          if (d._children) {
            console.log('对外投资--ok')
          } else {
            console.log('对外投资--no')
          }
        }

        isExpand = !isExpand
        if (d.hasChildren) {
          if (isExpand) {
            d3.select(_that).select('.isExpand').text('+')
          } else {
            d3.select(_that).select('.isExpand').text('-')
          }
        }

        if (d.name == 'origin') {
          return
        }
        if (d.children) {
          d._children = d.children
          d.children = null
        } else {
          d.children = d._children
          d._children = null
          // expand all if it's the first node
          if (d.name == 'origin') { d.children.forEach(expand) }
        }

        update(d, originalData, g)
      })
    }
  }
  // Collapse and Expand can be modified to include touched nodes.
  /**
     * Tree function to expand all nodes.
     * 展开树函数
     * @param {Object} d data object for D3 use.
     */
  function expand(d) {
    if (d._children) {
      d.children = d._children
      d.children.forEach(expand)
      d._children = null
    }
  }

  /**
     * Tree function to collapse children nodes.
     * 树函数来折叠子节点
     * @param {Object} d data object for D3 use.
     */
  function collapse(d) {
    if (d.children && d.children.length != 0) {
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
      hasChildNodeArr.push(d)
    }
  }

  /**
     * Tree function to redraw and zoom.
     * 重绘和缩放函数
     */
  function redraw() {
    treeG.attr('transform', 'translate(' + d3.event.translate + ')' +
            ' scale(' + d3.event.scale + ')')
  }
  /**
     * Tree functions to disable right click.
     * 禁用右击打事件
     */
  function disableRightClick() {
    // stop zoom
    if (d3.event.button == 2) {
      console.log('No right click allowed')
      d3.event.stopImmediatePropagation()
    }
  }

  /**
     * Tree sort function to sort and arrange nodes.
     * 树排序功能，排序和安排节点
     * @param {Object} a First element to compare.
     * @param {Object} b Second element to compare.
     * @return {Boolean} boolean indicating the predicate outcome.
     */
  function sortByDate(a, b) {
    // Compare the individuals based on participation date
    // (no need to compare when there is only 1 summary)
    var aNum = a.name.substr(a.name.lastIndexOf('(') + 1, 4)
    var bNum = b.name.substr(b.name.lastIndexOf('(') + 1, 4)
    // Sort by date, name, id.
    return d3.ascending(aNum, bNum) ||
            d3.ascending(a.name, b.name) ||
            d3.ascending(a.id, b.id)
  }
}

var saveChartImage = function(id) {
  console.log(mysvg)
  var imgSave = document.getElementById(id)

  var serializer = new XMLSerializer()
  var source = serializer.serializeToString(mysvg.node())

  source = '<?xml version="1.0" standalone="no"?>\r\n' + source
  var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)
  var canvas = document.createElement('canvas')
  canvas.width = 2000
  canvas.height = 1500

  var context = canvas.getContext('2d')
  context.fillRect(0, 0, 10000, 10000)
  context.fillStyle = '#fff'// 设置保存后的PNG 是白色的
  var image = new Image()
  image.src = url

  imgSave.onclick = function() {
    context.drawImage(image, 0, 0)
    var a = document.createElement('a')
    a.download = '股权架构图.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }
}
