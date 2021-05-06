import * as echarts from "echarts";
export default function initDragger(el, graphs, categoriess) {
let graph = graphs
let categories = categoriess
    var myChart = echarts.init(el);
    var winWidth = document.body.clientWidth;
    var winHeight = document.body.clientHeight;
    graph.nodes.forEach(function (node) {
        node.x = parseInt(Math.random() * winWidth);  //这里是最重要的如果数据中有返回节点x,y位置这里就不用设置，如果没有这里一定要设置node.x和node.y，不然无法定位节点 也实现不了拖拽了；
        node.y = parseInt(Math.random() * winHeight);
        //node.symbolSize = 40;
        node.sizeFlag = 40;
        node.category = node.attributes.modularity_class;
        node.label = {
            normal: {
                show: true
            }
        }
    });
    var option = {    //这里是option配置
        title: {
            text: '手机机销量图',
            subtext: '子文本',
            left:"center",
        },
        tooltip: {// 提示框的配置
            renderMode: 'html',
            trigger: 'item',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'radius'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            orient: 'vertical',
            left: '5%',
        },
        // toolbox:{
        //     orient:true,
        //     feature:{
        //         saveAsImage:{
        //             show:true
        //         }
        //     },
        //     x:"90%",
        //     show:true,
        //     y:"tom"
        // },
        // legend: [{    //图例组件
        //     data: categories.map(function (a) {
        //         return a.name;
        //     }),
        //     top: 0,
        // }],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',           //因为节点的位置已经有了就不用在这里使用布局了
                //zoom: 1.0,              //初始化比例
                circular: { rotateLabel: true },
                animation: false,
                data: graph.nodes,
                links: graph.links,
                categories: categories,   //节点分类的类目
                roam: true,   //添加缩放和移动
                draggable: false,   //注意这里设置为false，不然拖拽鼠标和节点有偏移
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                },
                label: {
                    show: false,
                    position: 'right',
                    formatter: '{b}'
                },
                emphasis: {
                    //focus: 'adjacency',
                    lineStyle: {
                        width: '2'
                    }
                }
            }
        ]
    };
    console.log(option)
    myChart.setOption(option);
    initInvisibleGraphic()
    function initInvisibleGraphic() {
        // Add shadow circles (which is not visible) to enable drag.
        myChart.setOption({
            graphic: echarts.util.map(option.series[0].data, function (item, dataIndex) {
                //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
                var tmpPos = myChart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
                return {
                    type: 'circle',
                    id: dataIndex,
                    position: tmpPos,
                    shape: {
                        cx: 0,
                        cy: 0,
                        r: 20
                    },
                    // silent:true,
                    invisible: true,
                    draggable: true,
                    ondrag: echarts.util.curry(onPointDragging, dataIndex),
                    z: 100              //使图层在最高层
                };
            })
        });
        window.addEventListener('resize', updatePosition);
        myChart.on('dataZoom', updatePosition);
    }
    myChart.on('graphRoam', updatePosition);
    function updatePosition() {    //更新节点定位的函数
        myChart.setOption({
            graphic: echarts.util.map(option.series[0].data, function (item, dataIndex) {
                var tmpPos = myChart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
                return {
                    position: tmpPos
                };
            })
        });

    }
    function onPointDragging(dataIndex) {      //节点上图层拖拽执行的函数
        var tmpPos = myChart.convertFromPixel({ 'seriesIndex': 0 }, this.position);
        option.series[0].data[dataIndex].x = tmpPos[0];
        option.series[0].data[dataIndex].y = tmpPos[1];
        myChart.setOption(option);
        updatePosition();
    }
}