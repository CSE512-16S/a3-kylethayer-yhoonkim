var dbconn = "http://carlise.cs.washington.edu:3000";

/*
 SELECT count(*) AS num_answers,
    languages.language
   FROM answers,
    languages,
    assignments
  WHERE answers.assignment_id = assignments.assignment_id AND assignments.language_id = languages.language_id
  GROUP BY languages.language;
*/
var num_answers_by_lang = dbconn + "/num_answers_by_lang";

/*
 SELECT count(*) AS num_answers,
    answers.color_name
   FROM answers,
    colors
  WHERE answers.color_id = colors.color_id
  GROUP BY answers.color_name;
*/
var num_answers_by_color_name = dbconn + "/num_answers_by_color_name";


/*
 SELECT colors.r,
    colors.g,
    colors.b,
    t.names
   FROM ( SELECT answers.color_id,
            string_agg(DISTINCT answers.color_name::text, ','::text) AS names
           FROM answers
          GROUP BY answers.color_id) t,
    colors
  WHERE t.color_id = colors.color_id;
*/
var distinct_color_names_by_rgb = dbconn + "/distinct_color_names_by_rgb";

/*
 SELECT string_agg(DISTINCT answers.color_name::text, ','::text) AS names,
    colors.r,
    colors.g,
    colors.b,
    languages.name AS language
   FROM languages,
    answers,
    assignments,
    colors
  WHERE assignments.assignment_id = answers.assignment_id AND languages.language_id = assignments.language_id AND colors.color_id = answers.color_id
  GROUP BY languages.name, colors.color_id, colors.r, colors.g, colors.b;
*/
function distinct_names_by_color_in_lang(lang) {
	return dbconn + "/distinct_names_by_color_in_lang?language=eq." + lang;
}

var languages = dbconn + "/languages";

var num_answers = dbconn + "/num_answers";

/*
 SELECT answers.color_name,
    languages.language_id,
    count(*) AS count
   FROM answers,
    languages,
    assignments
  WHERE assignments.assignment_id = answers.assignment_id AND languages.language_id = assignments.language_id
  GROUP BY languages.language_id, answers.color_name
  ORDER BY count(*) DESC;
 */
function sorted_color_names_by_lang_id(lang) {
	return dbconn + "/sorted_color_names_by_lang_id?language_id=eq." + lang;
}

/*
 Create view sorted_color_names_by_lang_name as
 SELECT answers.color_name,
    languages.language,
    count(*) AS count
   FROM answers,
    languages,
    assignments
  WHERE assignments.assignment_id = answers.assignment_id AND languages.language_id = assignments.language_id
  GROUP BY languages.language, answers.color_name
  ORDER BY count(*) DESC;
 */
function sorted_color_names_by_lang_name(lang) {
	return dbconn + "/sorted_color_names_by_lang_name?language=eq." + lang;
}
