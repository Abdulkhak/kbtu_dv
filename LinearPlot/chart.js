async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg");
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    const high = (d) => d.temperatureHigh;
    const highScaler = d3.scaleLinear()
        .domain(d3.extent(data,high))
        .range([dimension.boundedHeight,0]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    bounded.append("path")
        .attr("d",lineGenerator(data))
        // .attr("fill","none")
        .attr("stroke","red")

    lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => highScaler(high(d)));

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("stroke","blue")


    var scale = d3.scaleLinear()
        .domain([d3.min(yAccessor(d)), d3.max(high(d))])
        .range([0,dimension.boundedWidth]);

    // Add scales to axis
    var x_axis = d3.axisBottom()
        .scale(scale);

    //Append group and insert axis
    svg.append("g")
        .call(x_axis);
}

buildPlot();