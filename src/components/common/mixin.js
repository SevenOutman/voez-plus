/**
 * Created by Doma on 16/9/19.
 */
export const ActionSheet = {
    methods: {
        actionsheet(menu) {
            if (menu.showCancel !== false) {
                menu.showCancel = true
            }
            this.$dispatch("sys:actionsheet", menu)
        }
    }
}