import Locales from "/src/models/Locales.js"
import {useConstants} from "/src/composables/constants.js"
import {useUtils} from "/src/composables/utils.js"

const constants = useConstants()
const utils = useUtils()

export default class ContactOption {
    /** @constructs */
    constructor(jsonData) {
        this._id = jsonData["id"]
        this._value = jsonData["value"]
        this._valueShort = jsonData["valueShort"]
        this._faIcon = jsonData["faIcon"]
        this._locales = new Locales(jsonData["locales"] || {})
        this._copy = jsonData["copy"]

        this._href = jsonData["href"] || null
        // keep original href; normalization done in getHref()
    }

    /** @return {String} */
    get id() {
        return this._id
    }

    /**
     * @param {Function} localizationClosure
     * @param {Boolean} shorten
     * @return {String}
     */
    getValue(localizationClosure, shorten) {
        const key = shorten ? "valueShort" : "value"
        const localizedKey = localizationClosure(this._locales, key, true)

        if(localizedKey) return localizedKey
        return this.getStaticValue(shorten)
    }

    /** @return {String} */
    getStaticValue(shorten) {
        return shorten ? this._valueShort : this._value
    }

    /** @return {String} */
    get faIcon() {
        return this._faIcon
    }

    /**
     * @param {Function} localizationClosure
     * @return {String|null}
     */
    getHref(localizationClosure) {
        let hrefValue = null

        if(typeof localizationClosure === 'function') {
            hrefValue = localizationClosure(this._locales, "href", true)
        }

        if(!hrefValue)
            hrefValue = this._href

        if(!hrefValue)
            return null

        if(typeof hrefValue !== 'string')
            return hrefValue

        const baseUrl = constants.BASE_URL || ''

        if(/^https?:\/\//.test(hrefValue) || hrefValue.startsWith("//"))
            return hrefValue

        if(baseUrl && hrefValue.startsWith(baseUrl))
            return hrefValue

        return utils.resolvePath(hrefValue)
    }

    /** @return {String|null} */
    get href() {
        return this._href
    }

    /** @return {Boolean} */
    get copy() {
        return this._copy || false
    }
}