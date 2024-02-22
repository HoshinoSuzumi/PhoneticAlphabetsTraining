<script setup lang="ts">
import {useDayjs} from "#dayjs";
import {computed, ref} from "vue";
import {useMaidenheadGrid} from "~/composables/useMaidenheadGrid";
import {useMessage} from "~/composables/uni/useMessage";
import {ElAmap, type ElAmapInstance, ElAmapMouseTool, initAMapApiLoader} from "@vuemap/vue-amap";
import '@vuemap/vue-amap/dist/style.css'

useHead({
  title: '梅登黑德网格定位 · HAM c5r'
})

interface TargetInfo {
  map: {
    marker: AMap.Marker | null
    rectangle: AMap.Rectangle | null
  }
  longitude: number | null
  latitude: number | null
  grid: string | null
}

const dayjs = useDayjs()
const message = useMessage()

const clock_interval = ref()
const now_time = ref(dayjs())
const local_time_offset_hours = computed(() => {
  const offset_hours = dayjs(now_time.value).utcOffset() / 60
  let ret
  if (offset_hours > 0) ret = `+${offset_hours}`
  else ret = `${offset_hours}`
  return ret
})

const enable_measure = ref(false)
const input_locator = ref('')
const input_lon = ref('')
const input_lat = ref('')

const mapRef = ref<ElAmapInstance>()
const mapInst = computed(() => {
  return mapRef.value?.$$getInstance()
})
const locating = ref(false)

const m_location = ref<TargetInfo>({
  map: {
    marker: null,
    rectangle: null
  },
  longitude: null,
  latitude: null,
  grid: null
})
const t_location = ref<TargetInfo>({
  map: {
    marker: null,
    rectangle: null
  },
  longitude: null,
  latitude: null,
  grid: null
})
const distance = ref()
const converted_distance = computed(() => {
  if (!distance.value) return
  return distance.value < 1000 ? distance.value : `${(distance.value / 1000).toFixed(2)}KM`
})

const get_center_of_bound = (bound: number[][]): number[] => [bound[0][0] + (bound[1][0] - bound[0][0]) / 2, bound[0][1] + (bound[1][1] - bound[0][1]) / 2]

const update_straight_distance = () => {
  if (!m_location.value.longitude || !m_location.value.latitude || !t_location.value.longitude || !t_location.value.latitude) return
  const pointA = new AMap.LngLat(m_location.value.longitude, m_location.value.latitude)
  const pointB = new AMap.LngLat(t_location.value.longitude, t_location.value.latitude)
  const ret = Math.round(pointA.distance(pointB))
  distance.value = ret
  return ret
}

const update_location = () => {
  return new Promise<GeolocationCoordinates>((resolve, reject) => {
    if (!navigator.geolocation) reject()
    locating.value = true
    navigator.geolocation.getCurrentPosition(loc => {
      locating.value = false
      m_location.value.longitude = loc.coords.longitude
      m_location.value.latitude = loc.coords.latitude
      m_location.value.grid = useMaidenheadGrid().from_coords(m_location.value.longitude, m_location.value.latitude) as string
      resolve(loc.coords)
    }, err => {
      locating.value = false
      reject(err.message)
    })
  })
}

const fuck_map_view_to = (lng: number, lat: number, zoomLevel: number = 12) => {
  mapInst.value?.setZoomAndCenter(zoomLevel, new AMap.LngLat(lng, lat))
}

const fuck_move_elements = (lng: number, lat: number, target: 'my' | 'target') => {
  switch (target) {
    case 'my':
      m_location.value.map.marker?.setPosition(new AMap.LngLat(lng, lat).toArray())
      m_location.value.map.rectangle?.setBounds(new AMap.Bounds(...useMaidenheadGrid(m_location.value.grid as string).to_bound()))
      break
    case 'target':
      t_location.value.map.marker?.setPosition(new AMap.LngLat(lng, lat).toArray())
      t_location.value.map.rectangle?.setBounds(new AMap.Bounds(...useMaidenheadGrid(t_location.value.grid as string).to_bound()))
      t_location.value.map.rectangle?.setOptions({
        fillColor: 'rgba(15,171,0,0.02)',
        strokeColor: 'rgba(15,171,0,0.3)'
      })
      break
  }
}

const fuck_locate_grid = (locator: string) => {
  if (!locator || locator.length !== 6) {
    message.warning('请输入正确的坐标')
    return
  }
  locator = `${locator.toUpperCase().slice(0, 4)}${locator.toLowerCase().slice(4)}`
  const bound = useMaidenheadGrid(locator).to_bound()
  const lnglat = bound[0]

  t_location.value.longitude = lnglat[0]
  t_location.value.latitude = lnglat[1]
  t_location.value.grid = locator

  const center = get_center_of_bound(bound)
  fuck_map_view_to(center[0], center[1])
  fuck_move_elements(center[0], center[1], 'target')
  update_straight_distance()
}

const fuck_locate_lnglat = (lng: number, lat: number, moveToCenter: boolean = true) => {
  if (!lng || !lat) {
    message.warning('请输入正确的经纬度')
    return
  }
  const locator = useMaidenheadGrid().from_coords(lng, lat)
  t_location.value.longitude = lng
  t_location.value.latitude = lat
  t_location.value.grid = locator as string

  if (moveToCenter) fuck_map_view_to(lng, lat)
  fuck_move_elements(lng, lat, 'target')
  update_straight_distance()
}

const fuck_relocation = () => {
  update_location().then(loc => {
    fuck_move_elements(loc.longitude, loc.latitude, 'my')
    fuck_map_view_to(loc.longitude, loc.latitude)
    update_straight_distance()
  })
}

const handle_map_init = () => {
  // init elements
  m_location.value.map.marker = new AMap.Marker()
  m_location.value.map.rectangle = new AMap.Rectangle()
  t_location.value.map.marker = new AMap.Marker()
  t_location.value.map.rectangle = new AMap.Rectangle()
  mapInst.value?.add([
    m_location.value.map.marker,
    m_location.value.map.rectangle,
    t_location.value.map.marker,
    t_location.value.map.rectangle
  ])

  // init events
  mapInst.value?.on('click', (ev) => {
    fuck_locate_lnglat(ev.lnglat.lng, ev.lnglat.lat, false)
  })

  // refresh location
  update_location().then(loc => {
    m_location.value.map.marker?.setPosition(new AMap.LngLat(loc.longitude, loc.latitude).toArray())
    fuck_map_view_to(loc.longitude, loc.latitude)

    const m_location_bound = useMaidenheadGrid(m_location.value.grid as string).to_bound()
    m_location.value.map.rectangle?.setBounds(new AMap.Bounds(...m_location_bound))

    const center_point = get_center_of_bound(m_location_bound)
    const label = new AMap.LabelMarker({
      text: {
        content: m_location.value.grid as string,
        offset: [0, -5],
        style: {
          strokeColor: '#000000',
          fillColor: '#ffffff',
          fontSize: 16,
          fontWeight: 'black',
        },
        zooms: [8, 999],
        direction: 'center'
      },
      position: new AMap.LngLat(center_point[0], center_point[1])
    })
    mapInst.value?.add(label)
  })
}

const handle_map_measure = (e: number) => {
  message.info(`测量距离: ${(e / 1000).toFixed(2)}km`)
  enable_measure.value = false
}

onBeforeMount(() => {
  initAMapApiLoader({
    key: '3260f8fd404e9c82a80567ff92f9c2aa',
    securityJsCode: 'db1ce3a9da7b9614b351df419780853d',
  })
})

onMounted(() => {
  // clock
  clock_interval.value = setInterval(() => {
    now_time.value = dayjs()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(clock_interval.value)
  clock_interval.value = void 0
})
</script>

<template>
  <div class="w-full h-full p-0 grid grid-cols-1 md:grid-cols-3 gap-0 divide-x-2">
    <div class="w-full min-h-80 col-span-2 bg-white relative">
      <ClientOnly>
        <ElAmap ref="mapRef"
                @init="handle_map_init"
                view-mode="3D">
          <ElAmapMouseTool v-if="enable_measure" type="rule" @draw="handle_map_measure"/>
        </ElAmap>
      </ClientOnly>
      <div class="absolute right-4 bottom-4 w-hit h-fit">
        <div class="join join-vertical">
          <button class="join-item btn btn-sm btn-square btn-info"
                  :class="{'text-white': enable_measure, 'text-white/50': !enable_measure}"
                  @click="enable_measure = !enable_measure">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19.875 12c.621 0 1.125.512 1.125 1.143v5.714c0 .631-.504 1.143-1.125 1.143H4a1 1 0 0 1-1-1v-5.857C3 12.512 3.504 12 4.125 12h15.75zM9 12v2m-3-2v3m6-3v3m6-3v3m-3-3v2M3 3v4m0-2h18m0-2v4"/>
            </svg>
          </button>
          <button @click="fuck_relocation" class="join-item btn btn-sm btn-square btn-info text-white">
            <span v-if="locating" class="loading loading-spinner"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>
                <path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0m8-10v2m0 16v2m8-10h2M2 12h2"/>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col divide-y-2">
      <div class="bg-white">
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
        <div class="divider text-center mx-4 my-2 text-sky-300 font-bold text-sm">
          MY LOCATION
        </div>
        <div class="bg-neutral-200 m-4 mt-0 p-4 rounded-lg grid grid-cols-2 divide-x divide-neutral-400">
          <div class="flex justify-center items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/>
                <path d="M11.5 3a11.2 11.2 0 0 0 0 18m1-18a11.2 11.2 0 0 1 0 18M12 3v18"/>
              </g>
            </svg>
            <span class="text-xl font-bold font-mono leading-none">
              <span class="text-xs text-neutral-500 font-sans uppercase">longitude</span><br/>
              {{ m_location?.longitude?.toFixed(5) || '-' }}
            </span>
          </div>
          <div class="flex justify-center items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m1.6-5h14.8M3 12h18M4.6 17h14.8"/>
            </svg>
            <span class="text-xl font-bold font-mono leading-none">
              <span class="text-xs text-neutral-500 font-sans uppercase">latitude</span><br/>
              {{ m_location?.latitude?.toFixed(5) || '-' }}
            </span>
          </div>
          <div class="flex justify-center items-center gap-1.5 col-span-2 border-none mt-2">
            <!--            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/><path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0m8-10v2m0 16v2m8-10h2M2 12h2"/></g></svg>-->
            <span class="text-2xl font-bold font-sans text-center">
              <span class="text-xs text-neutral-500 font-sans uppercase">maidenhead</span><br/>
              <span class="text-sky-500">{{ m_location.grid || 'Locating...' }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="bg-white h-full p-4 pt-0">
        <div class="divider text-center mx-2 text-green-300 font-bold text-sm">
          TARGET
        </div>
        <div class="space-y-2">
          <fieldset class="flex flex-row gap-2">
            <UniInput class="w-full" v-model="input_locator" placeholder="梅登黑德网格 Grid Locator"/>
            <UniButton @click="fuck_locate_grid(input_locator)">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/>
                    <path d="m12 17l-1-4l-4-1l9-4z"/>
                  </g>
                </svg>
              </template>
              定位
            </UniButton>
          </fieldset>
          <hr>
          <fieldset class="flex flex-row flex-wrap gap-2">
            <UniInput class="flex-1" v-model="input_lon" placeholder="经度 Lng"/>
            <UniInput class="flex-1" v-model="input_lat" placeholder="纬度 Lat"/>
            <UniButton class="w-full xl:w-auto"
                       @click="fuck_locate_lnglat(parseFloat(input_lon), parseFloat(input_lat))">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>
                    <path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0m8-10v2m0 16v2m8-10h2M2 12h2"/>
                  </g>
                </svg>
              </template>
              跳转
            </UniButton>
          </fieldset>
        </div>
        <Transition name="fade-in" mode="out-in">
          <div v-if="t_location.longitude || t_location.latitude || t_location.grid"
               class="bg-neutral-200 mt-2 p-4 rounded-lg grid grid-cols-2 divide-x divide-neutral-400">
            <div class="flex justify-center items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/>
                  <path d="M11.5 3a11.2 11.2 0 0 0 0 18m1-18a11.2 11.2 0 0 1 0 18M12 3v18"/>
                </g>
              </svg>
              <span class="text-xl font-bold font-mono leading-none">
              <span class="text-xs text-neutral-500 font-sans uppercase">longitude</span><br/>
              {{ t_location?.longitude?.toFixed(5) || '-' }}
            </span>
            </div>
            <div class="flex justify-center items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m1.6-5h14.8M3 12h18M4.6 17h14.8"/>
              </svg>
              <span class="text-xl font-bold font-mono leading-none">
              <span class="text-xs text-neutral-500 font-sans uppercase">latitude</span><br/>
              {{ t_location?.latitude?.toFixed(5) || '-' }}
            </span>
            </div>
            <div class="flex justify-center items-center gap-1.5 col-span-2 xl:col-span-1 border-none mt-2">
              <!--            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/><path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0m8-10v2m0 16v2m8-10h2M2 12h2"/></g></svg>-->
              <span class="text-2xl font-bold font-sans text-center">
              <span class="text-xs text-neutral-500 font-sans uppercase">DISTANCE</span><br/>
              {{
                  converted_distance || '--'
                }}
            </span>
            </div>
            <div class="flex justify-center items-center gap-1.5 col-span-2 xl:col-span-1 border-none mt-2">
              <!--            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1" width="26" height="26" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/><path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0m8-10v2m0 16v2m8-10h2M2 12h2"/></g></svg>-->
              <span class="text-2xl font-bold font-sans text-center">
              <span class="text-xs text-neutral-500 font-sans uppercase">maidenhead</span><br/>
              <span class="text-green-500">{{ t_location.grid || '------' }}</span>
            </span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style>
.amap-container {
  @apply z-0;
}

.fade-in-enter-active,
.fade-in-leave-active {
  @apply transition duration-300
}

.fade-in-leave-to,
.fade-in-enter-from {
  @apply opacity-0 translate-y-4
}
</style>
