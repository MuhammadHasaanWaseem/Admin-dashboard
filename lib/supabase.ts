
import { createClient } from "@supabase/supabase-js";
import { REACT_APP_SUPABASE_URL as url} from '../enviroment/enviroments';
import { REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY as pk} from '../enviroment/enviroments';
const supabaseUrl = url;
const supabaseKey = pk;

export const supabase = createClient(supabaseUrl, supabaseKey);
        