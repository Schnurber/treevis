(function() {
	/**
	 * Treevis
	 * @author     Dieter Meiller <d.meiller@oth-aw.de>
	 * @version    1.0
	 *
	 */

	/**
	 * Creates a Treemap visualisation object.
	 *
	 * @param      {object}   json_data  The json data
	 * @param      {object}   props      The properties
	 * @return     {Treemap}  The new Treemap instance
	 */
	p5.prototype.createTreemap = function(json_data, props) {
		return new Treemap(json_data, props);

	}

	/**
	 * Creates a Sunburst visualisation object.
	 *
	 * @param      {object}   json_data  The json data
	 * @param      {object}   props      The properties
	 * @return     {Sunburst}  The new Sunburst instance
	 */
	p5.prototype.createSunburst = function(json_data, props) {
		return new Sunburst(json_data, props);
	}

})();