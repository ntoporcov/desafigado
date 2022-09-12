import React from 'react';
import {LineChart} from 'react-native-chart-kit';
import {useColorModeValue, useTheme} from 'native-base';
import {player} from './App';
import {Dimensions} from 'react-native';
import {AbstractChartConfig} from 'react-native-chart-kit/dist/AbstractChart';

const screenWidth = Dimensions.get('window').width;

export interface ChartProps {
  data: {
    players: {[i: string]: player};
    total: number;
    stored: boolean;
  };
}

const day = 86400000;
const fiveMin = 300000 * 6;
const fiveIntervals = (day + day / 6) / fiveMin;

const Chart = ({data}: ChartProps) => {
  const theme = useTheme();

  const firstDrink = Object.values(data.players).reduce(
    (previousValue, currentValue, valIndex) => {
      if (valIndex === 0) {
        return currentValue.activity[0];
      }
      if (currentValue.activity[0] < previousValue) {
        return currentValue.activity[0];
      } else {
        return previousValue;
      }
    },
    0,
  );

  const drinkData = (timeArr: number[]) => {
    let currAmount = 0;

    return Array.from(Array(fiveIntervals).keys()).map(index => {
      const currTime = index * fiveMin + (firstDrink - fiveMin * 2);
      const drinkAmount = timeArr.filter(
        drinkDate => drinkDate > currTime && drinkDate < currTime + fiveMin,
      ).length;

      currAmount = currAmount + drinkAmount;

      return currAmount;
    });
  };

  const datasets = Object.values(data.players || {}).map(playerData => {
    return {
      data: drinkData(playerData.activity),
      // @ts-ignore
      color: () => theme.colors[playerData.color]['500'],
    };
  });

  const legend = Object.values(data.players).map(playerData => {
    return playerData.name;
  });

  const labels = Array.from(Array(fiveIntervals).keys()).map(index => {
    const timePoint = new Date(index * fiveMin + firstDrink);

    if (index % 2) {
      const hour = timePoint.getUTCHours();

      return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    } else {
      return '';
    }
  });

  const chartData = {
    labels,
    datasets,
    legend, // optional
  };

  const textColor = useColorModeValue('#000000', '#ffffff');

  const chartConfig: AbstractChartConfig = {
    backgroundGradientFrom: useColorModeValue('#fff', '#000'),
    backgroundGradientTo: useColorModeValue('#fff', '#000'),
    color: (opacity = 1) => textColor,
    strokeWidth: 2, // optional, default 3
    // barPercentage: 0.5,
  };

  return (
    <LineChart
      data={chartData}
      width={screenWidth * 0.85}
      height={250}
      chartConfig={chartConfig}
    />
  );
};

export default Chart;
