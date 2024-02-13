<script setup lang="ts">
import {useDayjs} from "#dayjs";
import {computed, ref} from "vue";
import {useMaidenheadGrid} from "~/composables/useMaidenheadGrid";

useHead({
  title: '梅登黑德网格定位 · HAM c5r',
  script: [
    {src: '//api.map.baidu.com/api?type=webgl&v=1.0&ak=G53LAC6duWQm9TExskrP5Fxvn0QZ6oU9'}
  ]
})

const dayjs = useDayjs()

const clock_interval = ref()
const now_time = ref(dayjs())
const local_time_offset_hours = computed(() => {
  const offset_hours = dayjs(now_time.value).utcOffset() / 60
  let ret
  if (offset_hours > 0) ret = `+${offset_hours}`
  else ret = `${offset_hours}`
  return ret
})

const map = ref<any>(null)
const map_bounds_list = ref<string[]>([])
const locating = ref(false)
const location = ref<{
  longitude: number | null,
  latitude: number | null,
  grid: string | null
}>({
  longitude: null,
  latitude: null,
  grid: null
})

const update_location = () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) reject()
    locating.value = true
    navigator.geolocation.getCurrentPosition(loc => {
      locating.value = false
      resolve(loc)
    }, err => {
      locating.value = false
      reject(err.message)
    })
  })
}

const map_moveto = (lon: number, lat: number) => {
  map.value.centerAndZoom(new BMapGL.Point(lon, lat), 11);
}

const map_draw_bound = (locator: string) => {
  if (map_bounds_list.value.find(item => locator === item)) return
  map_bounds_list.value.push(locator)
  const bound = useMaidenheadGrid(locator).to_bound()
  let point_start = new BMapGL.Point(bound[0], bound[1])
  let point_end = new BMapGL.Point(bound[2], bound[3])

  let bound_rectangle = new BMapGL.Polygon([
    new BMapGL.Point(point_start.lng, point_start.lat),
    new BMapGL.Point(point_end.lng, point_start.lat),
    new BMapGL.Point(point_end.lng, point_end.lat),
    new BMapGL.Point(point_start.lng, point_end.lat)
  ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5})
  map.value.addOverlay(bound_rectangle)

  let center_point = new BMapGL.Point(
      bound[0] + (bound[2] - bound[0]) / 2,
      bound[1] + (bound[3] - bound[1]) / 2
  )
  let label = new BMapGL.Label(locator, {
    position: center_point,
    offset: new BMapGL.Size(-24, -8),
  })
  label.setStyle({
    color: '#5d5d5d',
    borderRadius: '0',
    borderWidth: '0',
    backgroundColor: '#00000000',
    fontWeight: 'bold',
    fontSize: '12px',
    lineHeight: '12px',
  });
  map.value.addOverlay(label)
}

onMounted(() => {
  // clock
  clock_interval.value = setInterval(() => {
    now_time.value = dayjs()
  }, 1000)

  // map init
  map.value = new BMapGL.Map('map-container', {
    enableDblclickZoom: false,
    displayOptions: {
      building: false
    }
  });
  map.value.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12);
  map.value.enableScrollWheelZoom(true);
  map.value.addEventListener('click', function (e: any) {
    map_draw_bound(useMaidenheadGrid().from_coords(e.latlng.lng, e.latlng.lat) as string)
  });

  // location
  update_location().then(loc => {
    location.value.longitude = loc.coords.longitude
    location.value.latitude = loc.coords.latitude
    location.value.grid = useMaidenheadGrid().from_coords(location.value.longitude, location.value.latitude) as string

    map_moveto(location.value.longitude, location.value.latitude)

    // render grid zone
    map_draw_bound(useMaidenheadGrid().from_coords(location.value.longitude, location.value.latitude) as string)
    let real_point = new BMapGL.Point(location.value.longitude, location.value.latitude)
    let marker = new BMapGL.Marker(real_point)
    map.value.addOverlay(marker)
  })
})

onBeforeUnmount(() => {
  clearInterval(clock_interval.value)
  clock_interval.value = void 0
})
</script>

<template>
  <div class="w-full h-full p-0 grid grid-cols-1 md:grid-cols-3 gap-0 divide-x-2">
    <div class="w-full min-h-60 col-span-2 bg-white">
      <div id="map-container" class="w-full h-full z-0"></div>
    </div>
    <div class="grid md:grid-rows-5 gap-0 divide-y-2">
      <div class="md:row-span-2 bg-white">
        <div class="w-full grid grid-cols-3 divide-x border-b shadow py-2">
          <h1 class="inline-flex flex-col items-center">
            <span class="text-xs text-neutral-500 font-black">Date (DMY)</span>
            <span class="font-mono text-xl">
              <span class="countdown">
                <span :style="`--value:${dayjs(now_time).date()};`"></span>/
                <span :style="`--value:${dayjs(now_time).month() + 1};`"></span>/
              </span>
              <span>{{ dayjs().year() }}</span>
            </span>
          </h1>
          <h1 class="inline-flex flex-col items-center">
            <span class="text-xs text-neutral-500 font-black">Time (UTC)</span>
            <span class="font-mono text-xl">
              <span class="countdown">
                <span :style="`--value:${dayjs(now_time).utc().hour()};`"></span>:
                <span :style="`--value:${dayjs(now_time).utc().minute()};`"></span>:
                <span :style="`--value:${dayjs(now_time).utc().second()};`"></span>
              </span>
            </span>
          </h1>
          <h1 class="inline-flex flex-col items-center">
            <span class="text-xs text-neutral-500 font-black">Local (UTC{{ local_time_offset_hours }})</span>
            <span class="font-mono text-xl">
              <span class="countdown">
                <span :style="`--value:${dayjs(now_time).hour()};`"></span>:
                <span :style="`--value:${dayjs(now_time).minute()};`"></span>:
                <span :style="`--value:${dayjs(now_time).second()};`"></span>
              </span>
            </span>
          </h1>
        </div>
        <div class="bg-neutral-200 m-4 p-4 rounded-lg grid grid-cols-2 divide-x divide-neutral-400">
          <div class="flex justify-center items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/>
                <path d="M11.5 3a11.2 11.2 0 0 0 0 18m1-18a11.2 11.2 0 0 1 0 18M12 3v18"/>
              </g>
            </svg>
            <span class="text-xl font-bold font-mono leading-none">
              <span class="text-xs text-neutral-500 font-sans uppercase">longitude</span><br/>
              {{ location?.longitude?.toFixed(6) || '-' }}
            </span>
          </div>
          <div class="flex justify-center items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m1.6-5h14.8M3 12h18M4.6 17h14.8"/>
            </svg>
            <span class="text-xl font-bold font-mono leading-none">
              <span class="text-xs text-neutral-500 font-sans uppercase">latitude</span><br/>
              {{ location?.latitude?.toFixed(6) || '-' }}
            </span>
          </div>
          <div class="flex justify-center items-center gap-1.5 col-span-2 border-none mt-2">
            <!--            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/><path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0m8-10v2m0 16v2m8-10h2M2 12h2"/></g></svg>-->
            <span class="text-2xl font-bold font-sans text-center">
              <span class="text-xs text-neutral-500 font-sans uppercase">maidenhead</span><br/>
              {{ location.grid || 'Locating...' }}
            </span>
          </div>
        </div>
        <div class="px-4">
          <button class="btn btn-block" :disabled="locating"
                  @click="update_location().then(loc => {map_moveto(loc.coords.longitude, loc.coords.latitude)})">
            <span v-if="locating" class="loading loading-spinner"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/>
                <path d="m12 17l-1-4l-4-1l9-4z"/>
              </g>
            </svg>
            {{ locating ? '定位中...' : '重新定位' }}
          </button>
        </div>
      </div>
      <div class="md:row-span-3 bg-white flex justify-center items-center">
        <h2 class="text-sm text-neutral-300 font-bold">前面的区域，以后再来探索吧!</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
