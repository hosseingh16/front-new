<template>
  <div class="relative">
    <div class="bg-white px-3 py-5 rounded-lg mt-24 h-[260px] overflow-clip">
      <table>
        <thead>
          <tr
            class="[&>th]:font-medium [&>th]:text-gray-500 [&>th]:text-right border-b-2 border-[#EBECF1]"
          >
            <th>کارجو</th>
            <th>سابقه کاری</th>
            <th>نرم‌افزار حسابداری</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr class="h-2"></tr>
          <tr class="[&>td]:p-3 bg-[#EDF0FC]">
            <td class="flex items-start gap-3 w-[250px]">
              <img src="/images/person-1.png" />
              <div>
                <p>حسین حوری</p>
                <div class="flex items-center gap-3">
                  <Icon name="svg:personalcard" />
                  <span class="text-gray-700">1387</span>
                </div>
                <div class="flex items-center gap-3">
                  <Icon name="svg:location" class="text-gray-500 w-[15px] h-[14px]" />
                  <span class="text-gray-700">تهران</span>
                </div>
              </div>
            </td>
            <td class="w-[250px] p-0">
              <div
                v-for="(item, index) in topItems"
                class="flex items-center gap-2"
                :class="{ '-mt-[25px]': index == 0 }"
              >
                <div class="border-2 w-[8px] border-blue-500 rounded-lg"></div>
                <span>{{ item.title }}</span>
                <div class="h-[25px] w-[1.5px] bg-gray-200"></div>
                <span class="text-blue-500">{{ item.duration }} سال</span>
              </div>
            </td>
            <td class="w-[250px]" style="padding-bottom: 0 !important">
              <div
                class="w-[120px] rounded-lg bg-[rgba(111,10,16,0.2)] px-2 py-0 h-[32px]"
              >
                <input
                  id="rd1"
                  type="radio"
                  class="radio text-[#6F0A10] radio-sm bg-red-600 checked:bg-[rgba(111,10,16,0.2)]"
                  checked
                />
                <label for="rd1" class="text-[#6F0A10] mr-2">اوراش</label>
              </div>
              <div class="flex justify-between mt-2">
                <span>زیر سیستم انبار</span>
                <span class="text-blue-500">% 60</span>
              </div>
              <div class="-mt-4">
                <progress
                  class="progress progress-primary h-1"
                  value="60"
                  max="100"
                ></progress>
              </div>
              <div class="flex justify-between -mt-3">
                <span>زیر سیستم فروش</span>
                <span class="text-blue-500">% 75</span>
              </div>
              <div class="-mt-4">
                <progress
                  class="progress progress-primary h-1"
                  value="75"
                  max="100"
                ></progress>
              </div>
            </td>
            <td class="w-[220px]">
              <Icon name="svg:svg-1" class="absolute -top-[40px] h-[350px] w-[200px]" />
            </td>
          </tr>
          <tr class="h-2"></tr>
          <tr class="[&>td]:p-3 bg-[#EDF0FC] blur-[2px]">
            <td class="flex items-start gap-3 w-[250px]">
              <img src="/images/person-2.jpg" class="w-[72px] h-[72px] rounded-lg" />
              <div>
                <p>ستایش حیدری</p>
                <div class="flex items-center gap-3">
                  <Icon name="svg:personalcard" />
                  <span class="text-gray-700">1387</span>
                </div>
                <div class="flex items-center gap-3">
                  <Icon name="svg:location" class="text-gray-500 w-[15px] h-[14px]" />
                  <span class="text-gray-700">تهران</span>
                </div>
              </div>
            </td>
            <td class="w-[250px]">
              <div v-for="item in topItems" class="flex items-center gap-2">
                <div class="border-2 w-[8px] border-blue-500 rounded-lg"></div>
                <span>{{ item.title }}</span>
                <div class="h-[25px] w-[1.5px] bg-gray-200"></div>
                <span class="text-blue-500">{{ item.duration }} سال</span>
              </div>
            </td>
            <td class="w-[250px]" style="padding-bottom: 0 !important">
              <div class="w-[120px] rounded-lg bg-[#93B027] px-2 py-0 h-[32px]">
                <input
                  id="rd1"
                  type="radio"
                  class="radio text-[#FCB428] radio-sm checked:bg-[#93B027]"
                  checked
                />
                <label for="rd1" class="text-white mr-2">هلو</label>
              </div>
              <div class="flex justify-between mt-2">
                <span>زیر سیستم انبار</span>
                <span class="text-blue-500">% 60</span>
              </div>
              <div class="-mt-4">
                <progress
                  class="progress progress-primary h-1"
                  value="60"
                  max="100"
                ></progress>
              </div>
              <div class="flex justify-between -mt-3">
                <span>زیر سیستم فروش</span>
                <span class="text-blue-500">% 75</span>
              </div>
              <div class="-mt-4">
                <progress
                  class="progress progress-primary h-1"
                  value="75"
                  max="100"
                ></progress>
              </div>
            </td>
            <td class="w-[220px]"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables
const topItems = [
  { title: 'ناظر مالیاتی', duration: 5 },
  { title: 'مشاور مالی', duration: 3 },
  { title: 'حسابدار', duration: 6 },
];
</script>
