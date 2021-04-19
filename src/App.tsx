import React from "react";
import "./App.css";
import { AppBar, Box, Button, ButtonGroup, Container, Grid, Toolbar, Typography } from "@material-ui/core";
import { useInterval } from "./useInterval";
import Plot from 'react-plotly.js';

interface Raindrop {
  x: number;
  y: number;
  distance: number;
  isInside: boolean;
}

// generate random X-Y values and determine if they are inside or outside the circle
function rain(dropCounter: number): Raindrop[] {
  const drops = [];

  for (let i = 0; i < dropCounter; i++) {
    const x = Math.random();
    const y = Math.random();
    const distance = Math.sqrt(x * x + y * y);
    const isInside = distance < 1.0;

    drops.push({
      x,
      y,
      distance,
      isInside
    });
  }

  return drops;
}

// generate the X-Y array for the point clouds
function xy(drops: Raindrop[]): Float32Array {
  const result = new Float32Array(2 * drops.length)

  for (let i = 0; i < drops.length; i++) {
    result[i * 2] = drops[i].x;
    result[i * 2 + 1] = drops[i].y;
  }

  return result;
}

// calculate Y of X to draw the circle
function y(x: number) {
  return Math.sqrt(1 - (x * x));
}

// generate a sequence of numbers
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
function range(start: number, stop: number, step: number) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
}

// circle SVG path
const CIRCLE_PATH = 'M0,1 ' + range(0, 1, 0.001).map(x => `L${x},${y(x)}`).join(' ');

function App() {
  const [raindrops, setRaindrops] = React.useState<Raindrop[]>([]);
  const [interval, setInterval] = React.useState<number | null>(null);

  // rain interval
  useInterval(() => {
    setRaindrops((raindrops) => [...raindrops, ...rain(100)]);
  }, interval);

  const dropsInside = raindrops.filter(d => d.isInside);
  const dropsOutside = raindrops.filter(d => !d.isInside);
  const approximation = 4 * (dropsInside.length / raindrops.length);

  const dropRain = (dropCounter: number) => () => setRaindrops((raindrops) => [...raindrops, ...rain(dropCounter)]);
  const startRain = () => setInterval(500);
  const stopRain = () => setInterval(null);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Monte Carlo Pi Simulation</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container>
          <Grid container item xs={6} justify="flex-end">
            <Plot
              data={[
                {
                  xy: xy(dropsInside),
                  type: 'pointcloud',
                  marker: { color: 'blue' },
                },
                {
                  xy: xy(dropsOutside),
                  type: 'pointcloud',
                  marker: { color: 'red' },
                }
              ]}
              layout={{
                xaxis: {
                  range: [0, 1],
                  dtick: 0.2,
                },
                yaxis: {
                  range: [0, 1],
                  dtick: 0.2,
                },
                shapes: [
                  {
                    type: 'path',
                    path: CIRCLE_PATH,
                    line: {
                      color: 'black'
                    }
                  },
                ],
                width: 400,
                height: 400,
                title: 'Approximtion of Pi',
                showlegend: false
              }}
            />
          </Grid>
          <Grid container item xs={6} justify="center" direction="column" alignItems="flex-start">
            <Typography variant="body1">Raindrops: {raindrops.length}</Typography>
            <Typography variant="body1" style={{ color: 'blue' }}>Inside: {dropsInside.length}</Typography>
            <Typography variant="body1" style={{ color: 'red' }}>Outside: {dropsOutside.length}</Typography>

            <Typography variant="body1">
              <br />
              Approximation of Pi:
              <br />
              π = 4 * ( Inside / Outside ) = {approximation}
            </Typography>
          </Grid>
        </Grid>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="body1">Add Raindrop:</Typography>

          <ButtonGroup disabled={interval !== null} variant="outlined" color="primary">
            <Button onClick={dropRain(1)}>1</Button>
            <Button onClick={dropRain(10)}>10</Button>
            <Button onClick={dropRain(100)}>100</Button>
            <Button onClick={dropRain(1000)}>1000</Button>
          </ButtonGroup>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="body1">Let It Rain:</Typography>

          {interval === null ? (
            <Button variant="outlined" color="primary" onClick={startRain}>Start</Button>
          ) : (
            <Button variant="outlined" color="primary" onClick={stopRain}>Stop</Button>
          )}
        </Box>

      </Container>
    </>
  );
}

export default App;
