

Component({
  properties: {
    bsText1: {
      type: String
    },
    bs1: {
      type: Boolean
    },
    bsText2: {
      type: String
    },
    bs2: {
      type: Boolean
    },
  },

  data: {

  },

  methods: {
    tap1() {
      this.triggerEvent("tap1", true)
    },
    tap2() {
      this.triggerEvent("tap2", true)
    },

  }
})