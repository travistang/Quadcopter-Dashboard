export const SUBSCRIBE_CHANNELS = {
  GYRO: '/quadcopter/gyro',
  ACCL: '/quadcopter/accl',
  ANGLE: '/quadcopter/angle',
  MOTOR: '/quadcopter/motor_power',
}

export const PID_PANELS = ['x', 'y']

export const MOTOR_TAGS = [
  'LF', 'RF', 'LB', 'RB'
]

export const PUBLISH_CHANNELS = {
  THRUST: '/quadcopter/thrust',
  TARGET_POSE: '/quadcopter/target_pose',
  SET_PID: '/quadcopter/set_pid',
  SET_GYRO_ACCL_RATIO: '/quadcopter/set_gyro_accl_ratio',
  RECALIBRATE_GYRO: '/quadcopter/recalibrate_gyro',
}

// https://coolors.co/987284-75b9be-d0d6b5-f9b5ac-ee7674
export const PLOT_COLORS = [
  "#75B9BE",
  "#987284",
  "#D0D6B5",
  "rgba(0,0,0, 0.4)"
]

export const SERVER_URL = 'localhost'

export const MQTT_ID = "dashboard"

export const NUM_RETAIN_DATA = 50
