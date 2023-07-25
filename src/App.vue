<script setup lang="ts">
import { Alel } from './models/alel-model';
import { Person } from './models/person-model';
import { Icon } from "@iconify/vue";

const combineArrays = (arr1: string[], arr2: string[]): string[][] => {
  let combined = arr1.map((element, index) => [element, arr2[index]]);
  let sorted = combined.map(pair => pair.sort((a, b) => a.localeCompare(b, undefined, { caseFirst: 'upper' })));
  return sorted;
}

const generateCombinations = (arrays: string[][]): string[][] => {
  const helper = (arrays: string[][], prefix: string[]): string[][] => {
    if (arrays.length === 0) {
      return [prefix];
    } else {
      let result: string[][] = [];
      let remaining = arrays.slice(1);
      for (let value of arrays[0]) {
        result = result.concat(helper(remaining, prefix.concat(value)));
      }
      return result;
    }
  }

  return helper(arrays, []);
}

const arraysToString = (arrays: string[][]): string => {
  return arrays.map(subarray => subarray.join('')).join('');
}

const arrayToString = (array: string[]): string => {
  return array.join('');
}


const alels = ref<Alel[]>([{
  name: "",
  options: ["", ""]
}]);

const addAlel = () => {
  alels.value.push({
    name: "",
    options: ["", ""]
  })
}

const deleteAlel = (alel: Alel) => {
  alels.value = alels.value.filter((el) => {
    return el !== alel
  })
}


const father = ref<Person>()
const mother = ref<Person>()

watch(alels, () => {
  mother.value = {
    values: alels.value.map((el) => {
      return {
        alel: el as Alel,
        values: ["", ""]
      }
    })
  };

  father.value = {
    values: alels.value.map((el) => {
      return {
        alel: el as Alel,
        values: ["", ""]
      }
    })
  };
}, {
  deep: true,
  immediate: true,
})

const parents = ref([father, mother]);

const result = ref<string[][]>();

const getResult = () => {
  result.value = [['']]

  const fatherCombinetions = [...new Set(generateCombinations(father.value!.values.map((el) => {
    return el.values
  })))];

  console.log(fatherCombinetions);

  const motherCombinations = generateCombinations(mother.value!.values.map((el) => {
    return el.values
  }));

  for (let father of fatherCombinetions) {
    result.value[0].push(arrayToString(father));
  }

  for (let mother of motherCombinations) {
    result.value.push([arrayToString(mother)]);

  }

  for (let x = 0; x < motherCombinations.length; x++) {
    for (let y = 0; y < fatherCombinetions.length; y++) {
      result.value[x + 1][y + 1] = arraysToString(combineArrays(motherCombinations[x], fatherCombinetions[y]));
    }
  }

}

watch(parents, () => {
  getResult()
}, {
  deep: true
});

const selectedIndexRow = ref(-1);
const selectedIndexCell = ref(-1);
const selectedValue = ref("");

const setSellectedCell = (indexRow: number, indexCell: number, value: string) => {
  if ((selectedIndexCell.value === indexCell && selectedIndexRow.value === indexRow) || (indexRow === 0 || indexCell === 0)) {
    selectedIndexCell.value = -1;
    selectedIndexRow.value = -1;
    selectedValue.value = "";

    return;
  }

  selectedIndexCell.value = indexCell;
  selectedIndexRow.value = indexRow;
  selectedValue.value = value;
}
const getStats = (array: string[][]): { stats: { value: string, number: number }[], meta: { total: number } } => {
  let processedArray = array.slice(1).map(row => row.slice(1));

  // Flatten the array and count each unique value
  let counts: { [key: string]: number } = {};
  for (let row of processedArray) {
    for (let value of row) {
      if (value in counts) {
        counts[value]++;
      } else {
        counts[value] = 1;
      }
    }
  }

  // Prepare stats array and total
  let stats = [];
  let total = 0;
  for (let value in counts) {
    stats.push({ value: value, number: counts[value] });
    total += counts[value];
  }

  // Sort stats in descending order by number
  stats.sort((a, b) => b.number - a.number);

  // Return result
  return {
    stats: stats,
    meta: {
      total: total
    }
  };
}

const stats = ref<
  {
    stats: { value: string, number: number }[],
    meta: { total: number }
  }
>();

watch(result, () => {
  if (!result.value)
    return

  stats.value = getStats(result.value);
}, {
  deep: true
})


</script>

<template>
  <div class="h-20">

  </div>
  <div class="mx-4">
    <div class="grid grid-cols-[1fr,1fr] gap-10">
      <div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="alel in alels" class="bg-white/10 rounded-xl p-4">
            <div class="flex justify-between gap-3">
              <InputText v-model="alel.name" placeholder="Назва алеля"/>
              <Button icon="pi pi-trash" @click="deleteAlel(alel)" size="large" severity="danger"></Button>
            </div>
            <div class="mt-5 grid grid-cols-1 gap-4">
              <div>
                Варіанти:
              </div>
              <div v-for="(option, index) in alel.options" class="flex justify-between gap-3">
                <InputText v-model="alel.options[index]" :placeholder="'Варіант' + option"></InputText>
                <Button icon="pi pi-trash" @click="alel.options.splice(index, 1)"></Button>
              </div>
              <Button class="mt-4" icon="pi pi-plus" @click="alel.options.push('')"></Button>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-10 h-10">
          <Button icon="pi pi-plus" severity="success" class="!w-full" @click="addAlel()"
            :disabled="alels.length >= 4"></Button>
        </div>
      </div>
      <div class="">
        <div class="grid grid-cols-1 gap-20">
          <div v-for="(parent, index) in parents" class="grid grid-cols-1 gap-6">
            <Icon :icon="index === 0 ? 'ep:male' : 'ep:female'" class="text-2xl"></Icon>
            <div v-for="alel in parent.value?.values">
              {{ alel.alel.name }}
              <div class="grid grid-cols-2 gap-4">
                <Dropdown placeholder="Значення алеля" v-model="alel.values[0]" :options="alel.alel.options"></Dropdown>
                <Dropdown placeholder="Значення алеля" v-model="alel.values[1]" :options="alel.alel.options"></Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="result && result[1][1]" class="mt-10 bg-white/10 p-6 mx-4 rounded-xl">
    <div class="grid grid-cols-1 w-full gap-2" :class="{ '!grid-cols-2': result.length < 9 }">
      <div>
        <h2 class="text-2xl my-2">
          Таблиця:
        </h2>
        <div v-for=" (row, rowIndex)  in  result " class="row grid-cols-2">
          <div v-for=" (cell, cellIndex)  in  row "
            class="border border-white text-base text-center transition-all duration-500"
            :class="{ 'bg-white/10': cellIndex === 0 || rowIndex === 0, '!bg-green-400/40': cellIndex === selectedIndexCell && rowIndex === selectedIndexRow, '!bg-green-400/20': (cellIndex <= selectedIndexCell && rowIndex === selectedIndexRow) || (cellIndex === selectedIndexCell && rowIndex <= selectedIndexRow) }"
            @click="setSellectedCell(rowIndex, cellIndex, cell)">
            <div v-if="cellIndex === 0 && rowIndex === 0" class="w-full h-full p-0 overflow-hidden">
              <div class="line w-full h-full max-h-[45px]">
                <div class="">
                  <div class="flex justify-end">
                    <Icon icon="ep:female" class="text-base mr-2 mt-2"></Icon>
                  </div>
                  <div class="flex justify-start">
                    <Icon icon="ep:male" class="text-base ml-2 mb-2"></Icon>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="py-2" :class="{'text-red-500': cell === selectedValue}">
              {{ cell }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="stats" class="mt-2">
        <h2 class="text-2xl">
          Статистика:  ( Загалом: {{ stats.meta.total }} )
        </h2>
        <div class="mt-2 text-xl">
          <div class="w-full h-fit grid grid-cols-1 gap-4">
            <div v-for="stat in stats?.stats" class="border border-white/10 p-2 rounded-xl">
              {{ stat.value }} : {{ stat.number }} ( {{ stat.number / stats.meta.total * 100 }}% )
              <div class="w-full h-2 bg-white/10 rounded-xl mt-2 overflow-hidden">
                <div class="h-2 bg-green-500 transition-all duration-300 "
                  :style="`width: ${Math.ceil(stat.number / stats.meta.total * 100)}%`">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="h-20">

  </div>
</template>

<style >
.p-inputtext {
  width: 100%;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10px, 100px));
  ;
}

.line {
  background:
    linear-gradient(to top right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) calc(50% - 1px),
      rgb(255, 255, 255) 50%,
      rgba(255, 255, 255, 0) calc(50% + 1px),
      rgba(255, 255, 255, 0) 100%);
}
</style>
